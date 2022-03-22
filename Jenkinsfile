pipeline {
    agent any

    environment {
        AWS_ACCESS_KEY_ID     = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        ARTIFACT_FILE = "xact-frontend-${env.GIT_BRANCH}-${env.BUILD_NUMBER}.zip".replaceAll("/", "-")
    }

    tools { nodejs "nodejs" }

    stages {

        stage('Create & Archive Build') {
            steps {
                sh 'npm install -g'
                sh 'npm run build-dev'
                sh 'mkdir -p dev-build'
                sh 'cp -R dist/xact-frontend-app/. dev-build/'
                script{
                   zip zipFile: "dev-${env.ARTIFACT_FILE}", archive: false, dir: 'dist/xact-frontend-app'
                }
                archiveArtifacts artifacts: "dev-${env.ARTIFACT_FILE}", fingerprint: true


                sh 'npm run build-prod'
                script{
                   zip zipFile: "prod-${env.ARTIFACT_FILE}", archive: false, dir: 'dist/xact-frontend-app'
                }
                archiveArtifacts artifacts: "prod-${env.ARTIFACT_FILE}", fingerprint: true

            }
        }
        stage('Deploy to Dev') {
            steps {
                sh 'aws s3 rm s3://xact-app-dev/ --recursive'
                sh 'aws s3 cp ./dev-build/ s3://xact-app-dev/ --recursive  --include "*" '
            }
        }
    }

}
