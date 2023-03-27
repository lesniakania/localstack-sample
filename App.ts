import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";

class App {
  static main() {
    const poolId = process.env.POOL_ID;
    const clientId = process.env.CLIENT_ID;
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;

    if (!poolId || !clientId || !email || !password)
      throw "Please run `pnpm setupall` first!";

    var authenticationData = {
      Username: email,
      Password: password,
    };
    var authenticationDetails = new AuthenticationDetails(authenticationData);
    var poolData = {
      endpoint: "http://localhost:4566",
      UserPoolId: poolId,
      ClientId: clientId,
    };
    var userPool = new CognitoUserPool(poolData);
    var userData = {
      Username: email,
      Pool: userPool,
    };
    var cognitoUser = new CognitoUser(userData);

    console.log(
      `Trying to authenticate user\n\twith email ${email}\n\tand password ${password}\n\tto a user pool with id ${poolId}\n\tand client id ${clientId}\n`
    );

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: () => {
        console.log("User logged in successfully.");
      },

      onFailure: (err: any) => {
        console.log("Login failure:");
        console.log(err);
      },
    });
  }
}

App.main();
