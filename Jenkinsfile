pipeline {
    agent any

    environment {
        AWS_ACCESS_KEY_ID     = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        DEV_CLIENT_ID = credentials('DEV_CLIENT_ID')
        DEV_ISSUER = credentials('DEV_ISSUER')
        PROD_CLIENT_ID = credentials('PROD_CLIENT_ID')
        PROD_ISSUER = credentials('PROD_ISSUER')
        ARTIFACT_FILE = "xact-frontend-${env.GIT_COMMIT}.zip"
    }

    tools { nodejs "nodejs" }

    stages {
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
        stage('Create & Archive Build') {
            steps {
                sh "npm run updateBuild -- dev ${DEV_CLIENT_ID} ${DEV_ISSUER}"
                sh 'npm run build-dev'
                sh 'rm -rf dev-build'
                sh 'mkdir -p dev-build'
                sh 'cp -R dist/xact-frontend-app/. dev-build/'
                script{
                   zip zipFile: "dev-${env.ARTIFACT_FILE}", archive: false, dir: 'dist/xact-frontend-app'
                }
                archiveArtifacts artifacts: "dev-${env.ARTIFACT_FILE}", fingerprint: true

                sh "npm run updateBuild -- prod ${PROD_CLIENT_ID} ${PROD_ISSUER}"
                sh 'npm run build-prod'
                script{
                   zip zipFile: "prod-${env.ARTIFACT_FILE}", archive: false, dir: 'dist/xact-frontend-app'
                }
                archiveArtifacts artifacts: "prod-${env.ARTIFACT_FILE}", fingerprint: true
                sh "aws s3 rm s3://xact-frontend-artifacts/prod-xact-frontend-${env.GIT_COMMIT}.zip"
                sh "aws s3 mv prod-xact-frontend-${env.GIT_COMMIT}.zip s3://xact-frontend-artifacts/"

            }
        }
        stage('Deploy to Dev') {
            steps {
                sh 'aws s3 rm s3://xact-app-dev/ --recursive'
                sh 'aws s3 cp ./dev-build/ s3://xact-app-dev/ --recursive  --include "*" '


            }
        }
        /* stage('End-to-End Testing'){
            steps{
                sh 'npm run e2e'
            }
        } */
    }
     post {
            always {
                cleanWs notFailBuild: true
                /*publishHTML (target : [allowMissing: false,
                                       alwaysLinkToLastBuild: true,
                                       keepAll: true,
                                       reportDir: 'mochawesome-report',
                                       reportFiles: 'mochawesome.html',
                                       reportName: 'End-to-End Test Reports',
                                       reportTitles: 'End-to-End Test Report'])*/
            }
    }

}
