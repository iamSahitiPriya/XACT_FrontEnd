pipeline {
    agent any

    environment {
        DEV_CLIENT_ID = credentials('DEV_CLIENT_ID')
        DEV_ISSUER = credentials('DEV_ISSUER')
        QA_CLIENT_ID = credentials('QA_CLIENT_ID')
        QA_ISSUER = credentials('QA_ISSUER')
        PROD_CLIENT_ID = credentials('PROD_CLIENT_ID')
        PROD_ISSUER = credentials('PROD_ISSUER')
        ARTIFACT_FILE = "xact-frontend-${env.GIT_COMMIT}.zip"
    }

    tools { nodejs "nodejs" }

    stages {
        stage("Security check"){
                        steps{
                            script{
                                try{
                                    sh "set +e"
                                    sh 'docker rm $(docker ps -a -q)'
                                    sh "docker run --rm -v ${env.WORKSPACE}:${env.WORKSPACE} 730911736748.dkr.ecr.ap-south-1.amazonaws.com/xact-common git file://${env.WORKSPACE} --debug"
                                    ERROR_COUNT = sh(returnStdout: true, script: "docker run -v ${env.WORKSPACE}:${env.WORKSPACE} 730911736748.dkr.ecr.ap-south-1.amazonaws.com/xact-common git file://${env.WORKSPACE} --json | grep -c commit")
                                    if(ERROR_COUNT != 0){
                                        throw new Exception("Build failed due to security issues. Please check the above logs.")
                                    }
                                }
                                catch(Exception e){
                                    if(e.getMessage() == "Build failed due to security issues. Please check the above logs."){
                                            currentBuild.result = "FAILURE"
                                            echo "${e}"
                                            sh "false"
                                    }
                                }
                            }

                        }
            }
        stage('NPM Install'){
            steps{
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'npm run test:coverage'
            }
        }

        stage("SonarQube analysis") {
            steps {
              withSonarQubeEnv('XACT_SONAR') {
                sh 'npm run sonar'
              }
            }
        }
        stage("Quality Gate") {
            steps {
              timeout(time: 1, unit: 'HOURS') {
                waitForQualityGate abortPipeline: true
              }
            }
        }
        stage('Create & Archive Dev Build') {
            steps {
                sh "npm run updateBuild -- dev ${DEV_CLIENT_ID} ${DEV_ISSUER}"
                sh 'npm run build-dev'
                sh 'rm -rf dev-build'
                sh 'mkdir -p dev-build'
                sh 'cp -R dist/xact-frontend-app/. dev-build/'
                script{
                   zip zipFile: "dev-${env.ARTIFACT_FILE}", archive: false, dir: 'dist/xact-frontend-app'
                }
                //archiveArtifacts artifacts: "dev-${env.ARTIFACT_FILE}", fingerprint: true
            }
        }
        stage('Deploy to Dev') {
            steps {
                sh 'aws s3 rm s3://xact-app-dev/ --recursive'
                sh 'aws s3 cp ./dev-build/ s3://xact-app-dev/ --recursive  --include "*" '


            }
        }
        stage('Create & Archive QA Build') {
                      steps {
                          sh "npm run updateBuild -- qa ${QA_CLIENT_ID} ${QA_ISSUER}"
                          sh 'npm run build-qa'
                          script{
                             zip zipFile: "qa-${env.ARTIFACT_FILE}", archive: false, dir: 'dist/xact-frontend-app'
                          }
                          //archiveArtifacts artifacts: "qa-${env.ARTIFACT_FILE}", fingerprint: true
                          sh "aws s3 rm s3://xact-frontend-artifacts/qa-xact-frontend-${env.GIT_COMMIT}.zip"
                          sh "aws s3 mv qa-xact-frontend-${env.GIT_COMMIT}.zip s3://xact-frontend-artifacts/"

                      }
        }
        stage('Create & Archive Prod Build') {
              steps {
                  sh "npm run updateBuild -- prod ${PROD_CLIENT_ID} ${PROD_ISSUER}"
                  sh 'npm run build-prod'
                  script{
                     zip zipFile: "prod-${env.ARTIFACT_FILE}", archive: false, dir: 'dist/xact-frontend-app'
                  }
                  //archiveArtifacts artifacts: "prod-${env.ARTIFACT_FILE}", fingerprint: true
                  sh "aws s3 rm s3://xact-frontend-artifacts/prod-xact-frontend-${env.GIT_COMMIT}.zip"
                  sh "aws s3 mv prod-xact-frontend-${env.GIT_COMMIT}.zip s3://xact-frontend-artifacts/"

              }
        }
    }
     post {
            always {
                cleanWs notFailBuild: true
            }
    }

}
