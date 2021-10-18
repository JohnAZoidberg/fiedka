module github.com/fiedka/fiedka

go 1.17

require (
	github.com/happybeing/webpack-golang-wasm-async-loader/gobridge v0.0.0-20201126150039-3d18007626dd
	github.com/linuxboot/fiano v1.0.1
)

require (
	github.com/9elements/converged-security-suite/v2 v2.6.0 // indirect
	github.com/orangecms/converged-security-suite/v2 v2.4.1-0.20211018211734-a9bcfb267f3f // indirect
)

replace github.com/9elements/converged-security-suite/v2 => github.com/orangecms/converged-security-suite/v2 v2.4.1-0.20211018211734-a9bcfb267f3f
