pipeline {
  agent any

  stages {
    stage('Cloner') {
      steps {
        git 'https://github.com/TON_USER/TON_REPO.git'
      }
    }

    stage('Installer et tester frontend') {
      steps {
        sh 'npm install'
        sh 'npm run test'
      }
    }

    stage('Installer et tester backend') {
      steps {
        dir('backend') {
          sh 'npm install'
          sh 'npm run test'
        }
      }
    }

    stage('Docker Build') {
      steps {
        sh 'docker-compose build'
      }
    }

    stage('Docker Deploy') {
      steps {
        sh 'docker-compose up -d'
      }
    }
  }
}
