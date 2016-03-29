#coding:utf-8

from lib.urlmap import urlmap
from lib.basehandler import RESTfulHandler
from tornado import web,gen
from Kubernetes.Entity.ProjectsModel import ProjectsList,ImageList,AppList,MirrorList
import json,salt.client
import random
from Kubernetes import tasks
from functions import curDatetime,curDir
from sqlalchemy import desc,or_


@urlmap(r'/projects\/?([0-9]*)')
class ProjectsHandler(RESTfulHandler):
    @web.asynchronous
    def get(self, ident):
        if ident:
            try:
                objServer = self.db.query(ProjectsList).get(ident)
                self.Result['rows'] = objServer.toDict()
                self.Result['total'] = 1
            except:
                self.Result['status'] = 404
                self.Result['info'] = 'No Row Found'
        else:
            page = int(self.get_argument('page', 1))
            searchKey = self.get_argument('searchKey', None)
            pagesize = int(self.get_argument('pagesize', self._PageSize))
            totalquery = self.db.query(ProjectsList.ProjectId)
            ProjectslistObj = self.db.query(ProjectsList)
            if searchKey:
                totalquery = totalquery.filter(or_(ProjectsList.ProjectName.like('%%%s%%' % searchKey),ProjectsList.ClusterIp==searchKey))
                ProjectslistObj = ProjectslistObj.filter(or_(ProjectsList.ProjectName.like('%%%s%%' % searchKey),ProjectsList.ClusterIp==searchKey))

            self.Result['total'] = totalquery.count()
            serverTask = ProjectslistObj.order_by(desc(ProjectsList.CreateTime)).limit(pagesize).offset((page - 1) * pagesize).all()
            self.Result['rows'] = map(lambda obj: obj.toDict(), serverTask)
            self.Result['username'] = self.get_current_user()
        self.finish(self.Result)

    @web.asynchronous
    def post(self,ident=0):
        data = json.loads(self.request.body)
        objTask = ProjectsList()
        objTask.ProjectName = data['params'].get('ProjectName', None)
        if objTask.ProjectName and len(str(objTask.ProjectName)) <= 30:
            try:
                self.db.query(ProjectsList).filter(ProjectsList.ProjectName==objTask.ProjectName).first().ProjectName
            except Exception,e:
                objTask.NginxImages = data['params'].get('NginxImages', None).get('name',None)
                objTask.RunEnvironment = data['params'].get('RunEnvironment', None)
                objTask.Replicas = data['params'].get('Replicas', 1)
                objTask.Status = data['params'].get('Status',"Pending")
                objTask.Port = data['params'].get('Port',80)
                nodeport = random.randint(30000,32000)
                objTask.NodePort = data['params'].get('NodePort',nodeport)
                ip1 = random.randint(10,254)
                ip2 = random.randint(10,254)
                objTask.ClusterIp = data['params'].get('ClusterIp',"10.254.{0}.{1}".format(ip1,ip2))
                objTask.CreateUser = self.get_current_user()
                objTask.CreateTime = curDatetime()
                ns = {}
                ns["kind"] = "Namespace"
                ns["apiVersion"] = "v1"
                ns["metadata"] = {}
                ns["metadata"]["name"] = "{0}".format(objTask.ProjectName)
                with open("{0}/Kubernetes/Handler/projson/projects/{1}_ns.json".format(curDir(),objTask.ProjectName),"w") as namespace:
                    namespace.write(json.dumps(ns,indent=2))
                app = {}
                app["apiVersion"] = "v1"
                app["kind"] = "ReplicationController"
                app["metadata"] = {}
                app["metadata"]["name"] = objTask.ProjectName
                app["metadata"]["namespace"] = objTask.ProjectName
                app["metadata"]["labels"] = {}
                app["metadata"]["labels"]["app"] = "nginx-php-{0}".format(objTask.ProjectName)
                app["metadata"]["labels"]["role"] = "nginx-php-{0}".format(objTask.ProjectName)
                app["metadata"]["labels"]["tier"] = "backend"
                app["spec"] = {}
                app["spec"]["replicas"] = 1
                app["spec"]["template"] = {}
                app["spec"]["template"]["metadata"] = {}
                app["spec"]["template"]["metadata"]["labels"] = {}
                app["spec"]["template"]["metadata"]["labels"]["app"] = "nginx-php-{0}".format(objTask.ProjectName)
                app["spec"]["template"]["metadata"]["labels"]["role"] = "nginx-php-{0}".format(objTask.ProjectName)
                app["spec"]["template"]["metadata"]["labels"]["tier"] = "backend"
                app["spec"]["template"]["spec"] = {}
                app["spec"]["template"]["spec"]["containers"] = []
                app["spec"]["template"]["spec"]["containers"].append({})
                app["spec"]["template"]["spec"]["containers"][0]["name"] = objTask.ProjectName
                app["spec"]["template"]["spec"]["containers"][0]["image"] = objTask.NginxImages
                app["spec"]["template"]["spec"]["containers"][0]["resources"] = {}
                app["spec"]["template"]["spec"]["containers"][0]["resources"]["requests"] = {}
                app["spec"]["template"]["spec"]["containers"][0]["resources"]["requests"]["cpu"] = "100m"
                app["spec"]["template"]["spec"]["containers"][0]["resources"]["requests"]["memory"] = objTask.RunEnvironment
                app["spec"]["template"]["spec"]["containers"][0]["env"] = []
                app["spec"]["template"]["spec"]["containers"][0]["env"].append({})
                app["spec"]["template"]["spec"]["containers"][0]["env"][0]["name"] = "GET_HOSTS_FROM"
                app["spec"]["template"]["spec"]["containers"][0]["env"][0]["value"] = "dns"
                app["spec"]["template"]["spec"]["containers"][0]["ports"] = []
                app["spec"]["template"]["spec"]["containers"][0]["ports"].append({})
                app["spec"]["template"]["spec"]["containers"][0]["ports"][0]["containerPort"] = 80
                with open("{0}/Kubernetes/Handler/projson/projects/{1}.json".format(curDir(),objTask.ProjectName),"w") as projects:
                    projects.write(json.dumps(app,indent=2))
                appservice = {}
                appservice["kind"] = "Service"
                appservice["apiVersion"] = "v1"
                appservice["metadata"] = {}
                appservice["metadata"]['namespace'] = objTask.ProjectName
                appservice["metadata"]["name"] = "nginx-server-{0}".format(objTask.ProjectName)
                appservice["spec"] = {}
                appservice["spec"]["selector"] = {}
                appservice["spec"]["selector"]["app"] = "nginx-php-{0}".format(objTask.ProjectName)
                appservice["spec"]["ports"] = []
                appservice["spec"]["ports"].append({})
                appservice["spec"]["ports"][0]["protocol"] = "TCP"
                appservice["spec"]["ports"][0]["port"] = 80
                appservice["spec"]["ports"][0]["nodePort"] = objTask.NodePort
                appservice["spec"]["clusterIP"] = objTask.ClusterIp
                appservice["spec"]["type"] = "NodePort"
                with open("{0}/Kubernetes/Handler/projson/projects/{1}-service.json".format(curDir(),objTask.ProjectName),"w") as proservice:
                    proservice.write(json.dumps(appservice,indent=2))
                local = salt.client.LocalClient()
                local.cmd("docker",["cmd.run",],[["/usr/bin/kubectl create -f {0}/Kubernetes/Handler/projson/projects/{1}.json && /usr/bin/kubectl create -f {0}/Kubernetes/Handler/projson/projects/{1}-service.json".format(curDir(),objTask.ProjectName)]])
                node_ip = local.cmd("docker",["cmd.run",],[["/usr/bin/kubectl get pods --namespace={name} -o wide |awk '{row}' |grep -v 'NODE'".format(name=objTask.ProjectName,row='{print $NF}')]])
                nodeip = node_ip.get('docker',None).values()[0]
                objTask.NodeIp = data['params'].get('NodeIp',nodeip)
                self.db.add(objTask)
                self.db.commit()
                self.Result['rows'] = 1
                self.Result['info'] = u'添加成功'
            else:
                self.write(json.dumps({"status":200,"msg":u"项目重复"}))
        else:
            self.Result['rows'] = 0
            self.Result['info'] = u'项目名称不能为空,请重新创建'
        self.finish(self.Result)

    @web.asynchronous
    def delete(self, ident):
        pro = self.db.query(ProjectsList).filter(ProjectsList.ProjectId==ident).first()
        tasks.nginxstop.delay(pro.ProjectName)
        self.db.query(ProjectsList).filter(ProjectsList.ProjectId==ident).delete()
        self.db.commit()
        self.Result['info'] = u'删除成功'
        self.finish(self.Result)

#获取镜像
@urlmap(r'/check\/?(.*)')
class CheckHandler(RESTfulHandler):
    @web.asynchronous
    def post(self,ident):
        data = json.loads(self.request.body)
        proname = data['projectname']
        try:
            pro = self.db.query(ProjectsList).filter(ProjectsList.ProjectName==proname).first().ProjectName
        except Exception,e:
            self.write(json.dumps({"status":200,"msg":u"项目正常"}))
            self.finish()
        else:
            return
#升级镜像
@urlmap(r'/update\/?([0-9]*)')
class UpdateImageHandler(RESTfulHandler):
    @web.asynchronous
    def post(self, ident):
        data = json.loads(self.request.body)
        images = data['params'].get('NginxImages', None)
        images_name = images.get("name",None).split("/")[-1]
        allimages = self.db.query(ProjectsList).filter(ProjectsList.ProjectId==ident).first().NginxImages
        if images_name != allimages:
            projectname = self.db.query(ProjectsList).filter(ProjectsList.ProjectId==ident).first().ProjectName
            allimages = self.db.query(ImageList).filter(ImageList.ImageName==images_name).first().AllImageName
            tasks.updateimage.delay(projectname,allimages)
            self.db.query(ProjectsList).filter(ProjectsList.ProjectId==ident).update({'NginxImages':images_name})
            self.db.commit()
            self.Result['info'] = u'更改成功'
            self.finish(self.Result)
        else:
            self.Result['info'] = u'更改失败'
            self.finish(self.Result)

#修改rc
@urlmap(r'/update/rc\/?([0-9]*)')
class ChangeRcHandler(RESTfulHandler):
    @web.asynchronous
    def post(self, ident):
        data = json.loads(self.request.body)
        objTask = self.db.query(ProjectsList).get(ident)
        objTask.Replicas = data['params'].get('rc', None)
        projectname = self.db.query(ProjectsList).filter(ProjectsList.ProjectId==ident).first().ProjectName
        status = self.db.query(ProjectsList).filter(ProjectsList.ProjectId==ident).first().Status
        if status != 'Offline' and objTask.Replicas:
            tasks.changereplicas.delay(projectname,objTask.Replicas)
            self.db.add(objTask)
            self.db.commit()
            self.Result['info'] = u'更改成功'
            self.finish(self.Result)
        else:
            self.Result['info'] = u'项目异常，不能更改'
            self.finish(self.Result)

#启动项目
@urlmap(r'/projects/start\/?([0-9]*)')
class StartHandler(RESTfulHandler):
    @web.asynchronous
    def get(self,ident):
        pro = self.db.query(ProjectsList).filter(ProjectsList.ProjectId==ident).first()
        tasks.nginxstart.delay(pro.ProjectName)
        self.db.query(ProjectsList).filter(ProjectsList.ProjectId==ident).update({'Status':"Running"})
        self.db.commit()
        self.Result['info'] = u'启动项目成功'
        self.finish(self.Result)
#停止项目
@urlmap(r'/projects/stop\/?([0-9]*)')
class StopHandler(RESTfulHandler):
    @web.asynchronous
    def get(self,ident):
        pro = self.db.query(ProjectsList).filter(ProjectsList.ProjectId==ident).first()
        tasks.nginxstop.delay(pro.ProjectName)
        self.db.query(ProjectsList).filter(ProjectsList.ProjectId==ident).update({'Status':"Offline"})
        with open('{0}/Kubernetes/Handler/projson/projects/{1}.json'.format(curDir(),pro.ProjectName),'r') as f:
            data = json.load(f)
            rc = data['spec']['replicas']
            if rc != pro.Replicas:
                data['spec']['replicas'] = int("{0}".format(pro.Replicas))
                with open('{0}/Kubernetes/Handler/projson/projects/{1}.json'.format(curDir(),pro.ProjectName),'w') as fw:
                    fw.write(json.dumps(data,indent=2))
        self.db.commit()
        self.Result['info'] = u'停止项目成功'
        self.finish(self.Result)

#web访问项目
@urlmap(r'/projects/visit\/?([0-9]*)')
class VisitHandler(RESTfulHandler):
    @web.asynchronous
    def get(self,ident):
        pro = self.db.query(ProjectsList).filter(ProjectsList.ProjectId==ident).first()
        ip = pro.NodeIp
        port = pro.NodePort
        self.redirect("http://{0}:{1}".format(ip,port),permanent=True)
        return

#仓库镜像
@urlmap(r'/image\/?([0-9]*)')
class ImageHandler(RESTfulHandler):
    @web.asynchronous
    def get(self, ident):
        if ident:
            try:
                objImage = self.db.query(ImageList).get(ident)
                self.Result['rows'] = objImage.toDict()
                self.Result['total'] = 1
            except:
                self.Result['status'] = 404
                self.Result['info'] = 'No Row Found'
        else:
            page = int(self.get_argument('page', 1))
            pagesize = int(self.get_argument('pagesize', self._PageSize))
            searchKey = self.get_argument('searchKey', None)
            totalquery = self.db.query(ImageList.ImageId)
            ImagelistObj = self.db.query(ImageList).filter(ImageList.UserName==self.get_current_user())
            if searchKey:
                ImagelistObj = ImagelistObj.filter(or_(ImageList.ImageName.like('%%%s%%' % searchKey)))
            ImagelistObj = ImagelistObj.order_by(desc(ImageList.ImageId)).limit(pagesize).offset((page - 1) * pagesize).all()
            self.Result['total'] = totalquery.count()
            self.Result['rows'] = map(lambda obj: obj.toDict(), ImagelistObj)
        self.finish(self.Result)

#创建应用
@urlmap(r'/app\/?([0-9]*)')
class AppHandler(RESTfulHandler):
    @web.asynchronous
    def get(self, ident):
        if ident:
            try:
                objImage = self.db.query(AppList).get(ident)
                self.Result['rows'] = objImage.toDict()
                self.Result['total'] = 1
            except:
                self.Result['status'] = 404
                self.Result['info'] = 'No Row Found'
        else:
            page = int(self.get_argument('page', 1))
            searchKey = self.get_argument('searchKey', None)
            pagesize = int(self.get_argument('pagesize', self._PageSize))
            totalquery = self.db.query(AppList.AppId)
            ApplistObj = self.db.query(AppList)
            if searchKey:
                totalquery = totalquery.filter(or_(AppList.AppName.like('%%%s%%' % searchKey)))
                ApplistObj = ApplistObj.filter(or_(AppList.AppName.like('%%%s%%' % searchKey)))

            self.Result['total'] = totalquery.count()
            appTask = ApplistObj.order_by(desc(AppList.AppId)).limit(pagesize).offset((page - 1) * pagesize).all()
            self.Result['rows'] = map(lambda obj: obj.toDict(), appTask)
        self.finish(self.Result)
    @web.asynchronous
    def post(self,ident=0):
        data = json.loads(self.request.body)
        objTask = AppList()
        objTask.ImageId = data['params'].get('ImageId', None)
        objTask.AppName = data['params'].get('AppName', None)
        if objTask.ImageId and objTask.AppName and len(str(objTask.AppName)) <= 30:
            imagename = self.db.query(ImageList).filter(ImageList.ImageId==objTask.ImageId).first()
            try:
                self.db.query(AppList).filter(AppList.AppName==objTask.AppName).first().AppName
            except Exception,e:
                objTask.ImageName = data['params'].get('ImageName', imagename.AllImageName)
                objTask.RunEnvironment = data['params'].get('RunEnvironment', None)
                objTask.Replicas = data['params'].get('Replicas', 1)
                objTask.Status = data['params'].get('Status',"Pending")
                nodeport = random.randint(30000,32000)
                objTask.NodePort = data['params'].get('NodePort',nodeport)
                ip1 = random.randint(10,254)
                ip2 = random.randint(10,254)
                objTask.ClusterIp = data['params'].get('ClusterIp',"10.254.{0}.{1}".format(ip1,ip2))
                objTask.CreateUser = self.get_current_user()
                objTask.CreateTime = curDatetime()
                ns = {}
                ns["kind"] = "Namespace"
                ns["apiVersion"] = "v1"
                ns["metadata"] = {}
                ns["metadata"]["name"] = "{0}".format(objTask.AppName)
                with open("{0}/Kubernetes/Handler/projson/apps/{1}_ns.json".format(curDir(),objTask.AppName),"w") as namespace:
                    namespace.write(json.dumps(ns,indent=2))
                app = {}
                app["apiVersion"] = "v1"
                app["kind"] = "ReplicationController"
                app["metadata"] = {}
                app["metadata"]["name"] = objTask.AppName
                app["metadata"]["namespace"] = objTask.AppName
                app["metadata"]["labels"] = {}
                app["metadata"]["labels"]["app"] = objTask.AppName
                app["metadata"]["labels"]["role"] = objTask.AppName
                app["metadata"]["labels"]["tier"] = "backend"
                app["spec"] = {}
                app["spec"]["replicas"] = 1
                app["spec"]["template"] = {}
                app["spec"]["template"]["metadata"] = {}
                app["spec"]["template"]["metadata"]["labels"] = {}
                app["spec"]["template"]["metadata"]["labels"]["app"] = objTask.AppName
                app["spec"]["template"]["metadata"]["labels"]["role"] = objTask.AppName
                app["spec"]["template"]["metadata"]["labels"]["tier"] = "backend"
                app["spec"]["template"]["spec"] = {}
                app["spec"]["template"]["spec"]["containers"] = []
                app["spec"]["template"]["spec"]["containers"].append({})
                app["spec"]["template"]["spec"]["containers"][0]["name"] = objTask.AppName
                app["spec"]["template"]["spec"]["containers"][0]["image"] = objTask.ImageName
                app["spec"]["template"]["spec"]["containers"][0]["resources"] = {}
                app["spec"]["template"]["spec"]["containers"][0]["resources"]["requests"] = {}
                app["spec"]["template"]["spec"]["containers"][0]["resources"]["requests"]["cpu"] = "100m"
                app["spec"]["template"]["spec"]["containers"][0]["resources"]["requests"]["memory"] = objTask.RunEnvironment
                app["spec"]["template"]["spec"]["containers"][0]["env"] = []
                app["spec"]["template"]["spec"]["containers"][0]["env"].append({})
                app["spec"]["template"]["spec"]["containers"][0]["env"][0]["name"] = "GET_HOSTS_FROM"
                app["spec"]["template"]["spec"]["containers"][0]["env"][0]["value"] = "dns"
                app["spec"]["template"]["spec"]["containers"][0]["ports"] = []
                app["spec"]["template"]["spec"]["containers"][0]["ports"].append({})
                app["spec"]["template"]["spec"]["containers"][0]["ports"][0]["containerPort"] = 80
                with open("{0}/Kubernetes/Handler/projson/apps/{1}.json".format(curDir(),objTask.AppName),"w") as appname:
                    appname.write(json.dumps(app,indent=2))
                appservice = {}
                appservice["kind"] = "Service"
                appservice["apiVersion"] = "v1"
                appservice["metadata"] = {}
                appservice["metadata"]['namespace'] = objTask.AppName
                appservice["metadata"]["name"] = objTask.AppName
                appservice["spec"] = {}
                appservice["spec"]["selector"] = {}
                appservice["spec"]["selector"]["app"] = objTask.AppName
                appservice["spec"]["ports"] = []
                appservice["spec"]["ports"].append({})
                appservice["spec"]["ports"][0]["protocol"] = "TCP"
                appservice["spec"]["ports"][0]["port"] = 80
                appservice["spec"]["ports"][0]["nodePort"] = objTask.NodePort
                appservice["spec"]["clusterIP"] = objTask.ClusterIp
                appservice["spec"]["type"] = "NodePort"
                with open("{0}/Kubernetes/Handler/projson/apps/{1}-service.json".format(curDir(),objTask.AppName),"w") as appserv:
                    appserv.write(json.dumps(appservice,indent=2))
                local = salt.client.LocalClient()
                local.cmd("docker",["cmd.run",],[["/usr/bin/kubectl create -f {0}/Kubernetes/Handler/projson/apps/{1}.json && /usr/bin/kubectl create -f {0}/Kubernetes/Handler/projson/apps/{1}-service.json".format(curDir(),objTask.AppName)]])
                node_ip = local.cmd("docker",["cmd.run",],[["/usr/bin/kubectl get pods --namespace={name} -o wide |awk '{row}' |grep -v 'NODE'".format(name=objTask.AppName,row='{print $NF}')]])
                nodeip = node_ip.get('docker',None).values()[0]
                objTask.NodeIp = data['params'].get('NodeIp', nodeip)
                project_pod = local.cmd("docker",["cmd.run",],[["/usr/bin/kubectl get pod --namespace={namespace} |awk '{name}' |grep -v 'NAME'".format(namespace=objTask.AppName,name='{print $1}')]])
                projectpod = project_pod.get('docker',None).values()[0]
                objTask.ProjectPod = data['params'].get('ProjectPod',projectpod)
                self.db.add(objTask)
                self.db.commit()
                self.Result['rows'] = 1
                self.Result['info'] = u'创建应用成功'
            else:
                self.write(json.dumps({"status":200,"msg":u"创建应该失败"}))
        else:
            self.write(json.dumps({"status":200,"msg":u"应用名重名"}))
        self.finish(self.Result)

    @web.asynchronous
    def delete(self, ident):
        pro = self.db.query(AppList).filter(AppList.AppId==ident).first()
        tasks.appstop.delay(pro.AppName)
        self.db.query(AppList).filter(AppList.AppId==ident).delete()
        self.db.commit()
        self.Result['info'] = u'删除成功'
        self.finish(self.Result)

#获取应用镜像
@urlmap(r'/appcheck\/?(.*)')
class CheckAppHandler(RESTfulHandler):
    @web.asynchronous
    def post(self,ident):
        data = json.loads(self.request.body)
        proname = data['appname']
        try:
            appname = self.db.query(AppList).filter(AppList.AppName==proname).first().AppName
        except Exception,e:
            self.write(json.dumps({"status":200,"msg":u"项目正常"}))
            self.finish()
        else:
            return

#升级应用镜像
@urlmap(r'/updateapp\/?([0-9]*)')
class UpdateAppHandler(RESTfulHandler):
    @web.asynchronous
    def post(self, ident):
        data = json.loads(self.request.body)
        images = data['params'].get('ImageName', None)
        images_name = images.get("name",None)
        allimages = self.db.query(AppList).filter(AppList.AppId==ident).first().ImageName
        if images_name != allimages:
            appname = self.db.query(AppList).filter(AppList.AppId==ident).first().AppName
            tasks.updateimage.delay(appname,images_name)
            self.db.query(AppList).filter(AppList.AppId==ident).update({'ImageName':images_name})
            self.db.commit()
            self.Result['info'] = u'升级成功'
            self.finish(self.Result)
        else:
            self.Result['info'] = u'升级失败'
            self.finish(self.Result)


#升级app rc
@urlmap(r'/app/rc\/?([0-9]*)')
class AppRcHandler(RESTfulHandler):
    @web.asynchronous
    def post(self, ident):
        data = json.loads(self.request.body)
        objTask = self.db.query(AppList).get(ident)
        objTask.Replicas = data['params'].get('rc', None)
        appname = self.db.query(AppList).filter(AppList.AppId==ident).first().AppName
        status = self.db.query(AppList).filter(AppList.AppId==ident).first().Status
        if status != "Offline" and objTask.Replicas:
            tasks.changereplicas.delay(appname,objTask.Replicas)
            self.db.add(objTask)
            self.db.commit()
            self.Result['info'] = u'更改成功'
            self.finish(self.Result)
        else:
            self.Result['info'] = u'项目未启动，不能更改'
            self.finish(self.Result)

#启动应用
@urlmap(r'/start\/?([0-9]*)')
class StartAppHandler(RESTfulHandler):
    @web.asynchronous
    def get(self,ident):
        pro = self.db.query(AppList).filter(AppList.AppId==ident).first()
        tasks.appstart.delay(pro.AppName)
        self.db.query(AppList).filter(AppList.AppId==ident).update({'Status':"Running"})
        self.db.commit()
        self.Result['info'] = u'启动应用成功'
        self.finish(self.Result)
#停止应用
@urlmap(r'/stop\/?([0-9]*)')
class StopAppHandler(RESTfulHandler):
    @web.asynchronous
    def get(self,ident):
        pro = self.db.query(AppList).filter(AppList.AppId==ident).first()
        tasks.appstop.delay(pro.AppName)
        self.db.query(AppList).filter(AppList.AppId==ident).update({'Status':"Offline"})
        with open('{0}/Kubernetes/Handler/projson/apps/{1}.json'.format(curDir(),pro.AppName),'r') as f:
            data = json.load(f)
            rc = data['spec']['replicas']
            if rc != pro.Replicas:
                data['spec']['replicas'] = int("{0}".format(pro.Replicas))
                with open('{0}/Kubernetes/Handler/projson/apps/{1}.json'.format(curDir(),pro.AppName),'w') as fw:
                    fw.write(json.dumps(data,indent=2))
        self.db.commit()
        self.Result['info'] = u'停止应用成功'
        self.finish(self.Result)

#web访问项目
@urlmap(r'/visit\/?([0-9]*)')
class AppVisitHandler(RESTfulHandler):
    @web.asynchronous
    def get(self,ident):
        pro = self.db.query(AppList).filter(AppList.AppId==ident).first()
        ip = pro.NodeIp
        port = pro.NodePort
        self.redirect("http://{0}:{1}".format(ip,port),permanent=True)
        return

#获取镜像，二级联动
@urlmap(r'/mirror/')
class MirrorHandler(RESTfulHandler):
    @web.asynchronous
    def get(self):
        mirror = self.db.query(MirrorList).filter(MirrorList.Level==1)
        mirror_list = []
        for i in mirror:
            d = {}
            d["id"] = i.MirrorId
            d["name"] = i.MirrorName
            d["code"] = i.MirrorId
            d["child"] = []
            child = self.db.query(MirrorList).filter(MirrorList.Level==2,MirrorList.Parent==i.MirrorId,MirrorList.UserName==self.get_current_user())
            for c in child:
                d["child"].append({"id":c.MirrorId,"name":c.MirrorName,"child":[]})
                mirror_list.append(d)
        rows = []
        [rows.append(i) for i in mirror_list if i not in rows]
        data = json.dumps(rows,indent=2)
        self.finish(data)

