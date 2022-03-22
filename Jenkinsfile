pipeline {
    agent any

    environment {
        AWS_ACCESS_KEY_ID     = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        ARTIFACT_FILE = "xact-frontend-${env.GIT_BRANCH}-${env.BUILD_NUMBER}.zip".replaceAll("/", "-")
    }

    tools { nodejs "nodejs" }

    stages {

        stage('Build') {
            steps {
                script{
                    env.USERINPUT = input message: 'Please enter the environment (production/developer)',
                                    parameters:[string(defaultValue:'', 
                                                        description:'',
                                                        name:'Environment')]
                }
                
                sh 'npm install -g'
                sh 'npm run build'
                sh 'ng build --configuration'
                
            }
        }
        stage('Archive Artifacts') {
            steps {
                script{
                    zip zipFile: "${env.ARTIFACT_FILE}", archive: false, dir: 'dist/xact-frontend-app'
                }
                archiveArtifacts artifacts: "${env.ARTIFACT_FILE}", fingerprint: true
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
