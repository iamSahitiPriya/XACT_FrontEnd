pipeline {
    agent any

    environment {
        AWS_ACCESS_KEY_ID     = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
    }

    tools { nodejs "nodejs" }

    stages {
        stage('Build') {
            steps {
                sh 'npm install -g'
                sh 'npm run build'
            }
        }
        stage('Deploy to Dev') {
            steps {
                sh 'aws s3 rm s3://xact-app/ --recursive'
                sh 'aws s3 cp ./dist/xact-frontend-app/ s3://xact-app/ --recursive  --include "*" '
            }
        }
    }

}
