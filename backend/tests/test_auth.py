"""Auth endpoint tests."""

from fastapi.testclient import TestClient

VALID_CREDENTIALS = {"email": "admin@example.com", "password": "admin1234"}


def test_health_reports_database_up(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "database": "up"}


def test_login_returns_a_token_and_the_user(client: TestClient) -> None:
    response = client.post("/auth/login", json=VALID_CREDENTIALS)

    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]
    assert body["user"]["email"] == "admin@example.com"
    assert "hashed_password" not in body["user"]


def test_login_rejects_a_wrong_password(client: TestClient) -> None:
    response = client.post(
        "/auth/login", json={**VALID_CREDENTIALS, "password": "wrong-password"}
    )

    assert response.status_code == 401


def test_login_rejects_an_unknown_email_with_the_same_message(client: TestClient) -> None:
    response = client.post(
        "/auth/login", json={"email": "nobody@example.com", "password": "admin1234"}
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"


def test_login_rejects_a_malformed_email(client: TestClient) -> None:
    response = client.post("/auth/login", json={"email": "not-an-email", "password": "admin1234"})

    assert response.status_code == 422


def test_me_returns_the_user_for_a_valid_token(client: TestClient) -> None:
    token = client.post("/auth/login", json=VALID_CREDENTIALS).json()["access_token"]

    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    assert response.json()["email"] == "admin@example.com"


def test_me_requires_a_token(client: TestClient) -> None:
    assert client.get("/auth/me").status_code == 401


def test_me_rejects_a_tampered_token(client: TestClient) -> None:
    response = client.get("/auth/me", headers={"Authorization": "Bearer not.a.token"})

    assert response.status_code == 401
