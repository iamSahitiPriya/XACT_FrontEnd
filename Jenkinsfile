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
    }
}
