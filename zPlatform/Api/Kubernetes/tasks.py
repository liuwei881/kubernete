#coding=utf-8

from celery import Celery,task
import os,salt.client
celery = Celery("tasks", broker="amqp://")
celery.conf.CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', 'amqp')
dir = os.getcwd()

@task(name='tasks.nginxstart')
def nginxstart(projectname):
    '''nginx 镜像启动'''
    local = salt.client.LocalClient()
    result = local.cmd("docker",["cmd.run",],[["/usr/bin/kubectl create -f {0}/Handler/projson/projects/{1}.json && /usr/bin/kubectl create -f {0}/Handler/projson/projects/{1}-service.json".format(dir,projectname)]])
    return result

@task(name='tasks.nginxstop')
def nginxstop(projectname):
    '''nginx 镜像停止'''
    local = salt.client.LocalClient()
    result = local.cmd("docker",["cmd.run",],[["/usr/bin/kubectl delete rc {0} --namespace={0} && /usr/bin/kubectl delete svc nginx-server-{0} --namespace={0} && /usr/bin/kubectl delete namespace {0}".format(projectname)]])
    return result

@task(name='tasks.appstart')
def appstart(appname):
    '''app 启动'''
    local = salt.client.LocalClient()
    result = local.cmd("docker",["cmd.run",],[["/usr/bin/kubectl create -f {0}/Handler/projson/apps/{1}.json && /usr/bin/kubectl create -f {0}/Handler/projson/apps/{1}-service.json".format(dir,appname)]])
    return result

@task(name='tasks.appstop')
def appstop(appname):
    '''app 停止'''
    local = salt.client.LocalClient()
    result = local.cmd("docker",["cmd.run",],[["/usr/bin/kubectl delete rc {0} --namespace={0} && /usr/bin/kubectl delete svc {0} --namespace={0} && /usr/bin/kubectl delete namespace {0}".format(appname)]])
    return result

@task(name='tasks.updateimage')
def updateimage(projectname,allimages):
    '''update镜像'''
    local = salt.client.LocalClient()
    result = local.cmd("docker",["cmd.run",],[["/usr/bin/kubectl rolling-update {0} --update-period=3s --image={1} --namespace={0}".format(projectname,allimages)]])
    return result

@task(name='tasks.changereplicas')
def changereplicas(projectname,replicas):
    '''变换replicas'''
    local = salt.client.LocalClient()
    result = local.cmd("docker",["cmd.run",],[["/usr/bin/kubectl scale rc {0} --replicas={1} --namespace={0}".format(projectname,replicas)]])
    return result
