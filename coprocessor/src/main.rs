use hyper::{
    service::{make_service_fn, service_fn},
    Body, Method, Request, Response, Server, StatusCode,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::convert::Infallible;
use hex;
use std::env;

#[derive(Serialize, Deserialize, Debug)]
struct GIORequest {
    domain: u16,
    id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GIOResponse {
    pub response_code: u16,
    pub response: String,
}

#[tokio::main(flavor = "current_thread")]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let addr = ([0, 0, 0, 0], 8080).into();

    let make_svc = make_service_fn(|_conn| async {
        Ok::<_, Infallible>(service_fn(router))
    });

    let server = Server::bind(&addr).serve(make_svc);

    println!("Server running at http://{}...", addr);

    server.await?;
    Ok(())
}

async fn router(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    match (req.method(), req.uri().path()) {
        (&Method::POST, "/v1/chat/completions") => handle_completion(req).await,
        (&Method::POST, "/gio") => handle_gio(req).await,
        (&Method::GET, "/health") => handle_health().await,
        _ => Ok(Response::builder()
            .status(StatusCode::NOT_FOUND)
            .body(Body::from("Not Found"))
            .unwrap()),
    }
}

async fn handle_completion(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let whole_body = hyper::body::to_bytes(req.into_body()).await;
    let body_bytes = match whole_body {
        Ok(bytes) => bytes,
        Err(_) => {
            return Ok(Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .body(Body::from("Could not read request body"))
                .unwrap());
        }
    };

    let raw_json_str = String::from_utf8_lossy(&body_bytes);
    let hex_encoded = hex::encode(raw_json_str.as_bytes());

    let gio_request = GIORequest {
        domain: 0x2b,
        id: format!("0x{}", hex_encoded),
    };

    let gio_request_json = serde_json::to_string(&gio_request).unwrap();
    let rollup_http_server_url = env::var("ROLLUP_HTTP_SERVER_URL").unwrap_or_else(|_| "http://127.0.0.1:8080".to_string());
    let gio_url = format!("{}/gio", rollup_http_server_url);

    println!("Forwarding request to: {}", gio_url);
    println!("Request body: {}", gio_request_json);

    let client = hyper::Client::new();

    let mock_request = Request::builder()
        .method(Method::POST)
        .uri(&gio_url)
        .header("Content-Type", "application/json")
        .body(Body::from(gio_request_json))
        .unwrap();

    match client.request(mock_request).await {
        Ok(res) => {
            let gio_response_body = hyper::body::to_bytes(res.into_body()).await;
            match gio_response_body {
                Ok(body) => {
                    let gio_response: Result<GIOResponse, _> = serde_json::from_slice(&body);
                    match gio_response {
                        Ok(gio_resp) => {
                            println!("Received GIOResponse: {:?}", gio_resp);

                            let hex_data = gio_resp.response.strip_prefix("0x").unwrap_or(&gio_resp.response);

                            match hex::decode(hex_data) {
                                Ok(decoded_bytes) => {
                                    match String::from_utf8(decoded_bytes) {
                                        Ok(decoded_str) => {
                                            println!("Decoded Response: {}", decoded_str);
                                            Ok(Response::new(Body::from(decoded_str)))
                                        },
                                        Err(e) => {
                                            let resp = json!({ "error": "Invalid UTF-8 data in response", "details": e.to_string() });
                                            Ok(Response::builder()
                                                .status(StatusCode::BAD_REQUEST)
                                                .header("Content-Type", "application/json")
                                                .body(Body::from(resp.to_string()))
                                                .unwrap())
                                        }
                                    }
                                }
                                Err(e) => {
                                    let resp = json!({ "error": "Invalid hex data in response", "details": e.to_string() });
                                    Ok(Response::builder()
                                        .status(StatusCode::BAD_REQUEST)
                                        .header("Content-Type", "application/json")
                                        .body(Body::from(resp.to_string()))
                                        .unwrap())
                                }
                            }
                        },
                        Err(e) => {
                            let resp = json!({ "error": "Invalid GIOResponse format", "details": e.to_string() });
                            Ok(Response::builder()
                                .status(StatusCode::BAD_REQUEST)
                                .header("Content-Type", "application/json")
                                .body(Body::from(resp.to_string()))
                                .unwrap())
                        }
                    }
                }
                Err(_) => {
                    let resp = json!({ "error": "Could not read GIO response body" });
                    Ok(Response::builder()
                        .status(StatusCode::BAD_REQUEST)
                        .header("Content-Type", "application/json")
                        .body(Body::from(resp.to_string()))
                        .unwrap())
                }
            }
        },
        Err(_) => Ok(Response::builder()
            .status(StatusCode::BAD_REQUEST)
            .body(Body::from("Could not forward request"))
            .unwrap()),
    }
}

async fn handle_gio(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let whole_body = hyper::body::to_bytes(req.into_body()).await;
    match whole_body {
        Ok(body) => {
            let gio_request: Result<GIORequest, _> = serde_json::from_slice(&body);
            match gio_request {
                Ok(gio_req) => {
                    println!("Received GIORequest: {:?}", gio_req);
                    let resp = json!({ "status": "success" });
                    Ok(Response::new(Body::from(resp.to_string())))
                }
                Err(_) => {
                    let resp = json!({ "error": "Invalid JSON" });
                    Ok(Response::builder()
                        .status(StatusCode::BAD_REQUEST)
                        .body(Body::from(resp.to_string()))
                        .unwrap())
                }
            }
        }
        Err(_) => {
            let resp = json!({ "error": "Could not read request body" });
            Ok(Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .body(Body::from(resp.to_string()))
                .unwrap())
        }
    }
}

async fn handle_health() -> Result<Response<Body>, Infallible> {
    Ok(Response::new(Body::from("OK")))
}
