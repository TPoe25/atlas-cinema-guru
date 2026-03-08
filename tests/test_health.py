from api.app import create_app

def test_health_ok():
    app = create_app()
    app.testing = True

    with app.test_client() as client:
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json["status"] == "OK"
