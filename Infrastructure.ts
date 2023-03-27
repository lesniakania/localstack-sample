#!/usr/bin/env node

import * as cdk from "aws-cdk-lib";
import {
  DefaultStackSynthesizer,
  Stack,
  Stage,
  StageProps,
  Duration,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  ClientAttributes,
  UserPool,
  UserPoolClient,
  VerificationEmailStyle,
  AccountRecovery,
} from "aws-cdk-lib/aws-cognito";

class CoreStage extends Stage {
  constructor(scope: Construct, id: string, stageProps: StageProps) {
    super(scope, id, stageProps);

    const userPool = new UserPool(scope, "DefaultUserPool", {
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      selfSignUpEnabled: false,
      userVerification: {
        emailStyle: VerificationEmailStyle.LINK,
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
    });

    new UserPoolClient(scope, "DefaultUserPoolClient", {
      userPool: userPool,
      accessTokenValidity: Duration.minutes(30),
      idTokenValidity: Duration.hours(2),
      refreshTokenValidity: Duration.hours(3),
      preventUserExistenceErrors: true,

      writeAttributes: new ClientAttributes().withStandardAttributes({
        email: true,
        phoneNumber: true,
      }),
      authFlows: {
        userSrp: true,
      },
    });
  }
}

const app = new cdk.App();
const stack = new Stack(app, "AppStack", {
  synthesizer: new DefaultStackSynthesizer({
    generateBootstrapVersionRule: false,
  }),
});
new CoreStage(stack, "CoreStage", {});
app.synth();
