package main

import (
	"strings"
	"testing"

	"github.com/BenedictKing/ccx/internal/config"
)

func TestBuildStartupMessages_DefaultsToIndonesianBanner(t *testing.T) {
	t.Parallel()

	originalVersion := Version
	originalBuildTime := BuildTime
	originalGitCommit := GitCommit
	Version = "v-test"
	BuildTime = "2026-03-12_01:02:03"
	GitCommit = "abc123"
	t.Cleanup(func() {
		Version = originalVersion
		BuildTime = originalBuildTime
		GitCommit = originalGitCommit
	})

	envCfg := &config.EnvConfig{
		Port:           3000,
		Env:            "development",
		ProxyAccessKey: "your-proxy-access-key",
	}

	messages := buildStartupMessages(envCfg)
	if len(messages) == 0 {
		t.Fatal("expected startup messages")
	}

	if got := messages[0]; got.level != "Startup" || got.text != "Server proxy API CCX telah dimulai" {
		t.Fatalf("unexpected startup message: %+v", got)
	}

	joined := make([]string, 0, len(messages))
	for _, message := range messages {
		joined = append(joined, message.text)
	}

	output := strings.Join(joined, "\n")
	for _, want := range []string{
		"Versi: v-test",
		"Waktu build: 2026-03-12_01:02:03",
		"Git commit: abc123",
		"Antarmuka admin: http://localhost:3000",
		"Alamat API: http://localhost:3000/v1",
		"Pemeriksaan kesehatan: GET /health",
		"Lingkungan: development",
		"Kunci akses: your-proxy-access-key (nilai default, disarankan ubah melalui file .env)",
	} {
		if !strings.Contains(output, want) {
			t.Fatalf("expected output to contain %q, got:\n%s", want, output)
		}
	}

	for _, unwanted := range []string{
		"CCX API代理服务器已启动",
		"管理界面",
		"健康检查",
		"访问密钥",
	} {
		if strings.Contains(output, unwanted) {
			t.Fatalf("did not expect Chinese startup text %q in output:\n%s", unwanted, output)
		}
	}
}
