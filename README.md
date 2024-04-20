![LearnSphere Service Titles Auth](https://github.com/singhmeharjeet/learn-sphere-auth-service/assets/32851308/f934bcf4-8f97-4d3d-a7ea-6e623817dbb0)

Welcome Message

    GET /

    Returns a welcome message indicating successful connection to the Auth Service.

Sign Up

    POST /signup

    Registers a new user.

    Request Body:
        username: Unique username of the user.
        password: Password of the user.
        role: Role of the user (e.g., admin, teacher, student).

    Response:
        success: Indicates if the operation was successful.
        message: Information message.
        user: Details of the signed-up user.
        token: JWT token for authentication.

Login

    POST /login

    Logs in an existing user.

    Request Body:
        username: Username of the user.
        password: Password of the user.

    Response:
        success: Indicates if the operation was successful.
        message: Information message.
        user: Details of the logged-in user.
        token: JWT token for authentication.

Verify Token

    GET /verify

    Verifies the authenticity of a JWT token.

    Response:
        success: Indicates if the token verification was successful.
        message: Information message.
        user: Details of the user if the token is valid.

Refresh Token (Incomplete)

    GET /refresh

    Note: This endpoint is incomplete and not functioning properly. It is meant for refreshing access tokens.

    Response:
        Currently, this endpoint returns a 501 error (Not Implemented).

Error Handling

In case of errors, appropriate HTTP status codes are returned along with error messages in the response body.
