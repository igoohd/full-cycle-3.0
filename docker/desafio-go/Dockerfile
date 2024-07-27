FROM golang:1.23rc2-alpine3.20 AS build

WORKDIR /go/src

COPY main.go .

RUN CGO_ENABLED=0 GO111MODULE=off go build -ldflags="-s -w" -o /go/src/main

FROM scratch

WORKDIR /go/src

COPY --from=build /go/src/main .

ENTRYPOINT ["./main"]