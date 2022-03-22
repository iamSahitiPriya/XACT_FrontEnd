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
                script{
                   zip zipFile: "prod-${env.ARTIFACT_FILE}-dev", archive: false, dir: 'dist/xact-frontend-app'
                }

                sh 'npm run build-prod'
                script{
                   zip zipFile: "prod-${env.ARTIFACT_FILE}", archive: false, dir: 'dist/xact-frontend-app'
                }
            }
        }
        stage('Deploy to Dev') {
            steps {
                sh 'aws s3 rm s3://xact-app-dev/ --recursive'
                sh 'aws s3 cp ./dist/xact-frontend-app/ s3://xact-app-dev/ --recursive  --include "*" '
            }
        }
    }

}
