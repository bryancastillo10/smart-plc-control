WS_URL = ws://localhost:8080/api/v1/ws/simulation

run:
	go run cmd/api/main.go

migrate:
	go run cmd/api/main.go --migrate

test:
	go test ./...

fmt:
	gofmt -w .

dev:
	air -c air.toml

ws:
	wscat -c ${WS_URL}