# -*- coding: utf-8 -*-
from sqlalchemy import Column, Integer, String, Text, DateTime
from lib.Route import BaseModel

class ProjectsList(BaseModel):
    """
    服务器信息列表
    """
    __tablename__ = 'bk_project_list'

    ProjectId = Column('fi_id', Integer, primary_key=True)
    ProjectName = Column('fs_projectname', String(50))
    NginxImages = Column('fs_nginximages',String(50))
    RunEnvironment = Column('fs_runenvironment',String(20))
    Port = Column('fi_port',Integer)
    NodeIp = Column('fs_nodeip',String(50))
    NodePort = Column('fi_nodeport',Integer)
    Replicas = Column('fi_replicas',Integer)
    ClusterIp = Column('fs_clusterip',String(50))
    Status = Column('fs_status',String(20))
    NsInfo = Column('fs_nsinfo',Text)
    RcInfo = Column('fs_rcinfo',Text)
    SeInfo = Column('fs_seinfo',Text)
    CreateUser = Column('fs_create_user', String(20))
    """:param CreateId: 创建人"""
    CreateTime = Column('ft_create_time', DateTime)
    """:param CreateTime: 创建时间"""

    def toDict(self):
        return {
            'ProjectId': self.ProjectId,
            'ProjectName':self.ProjectName,
            'NginxImages':self.NginxImages,
            'RunEnvironment':self.RunEnvironment,
            'Port':self.Port,
            'NodeIp':self.NodeIp,
            'NodePort':self.NodePort,
            'Replicas':self.Replicas,
            'ClusterIp':self.ClusterIp,
            'Status':self.Status,
            'NsInfo':self.NsInfo,
            'RcInfo':self.RcInfo,
            'SeInfo':self.SeInfo,
            'CreateUser': self.CreateUser,
            'CreateTime': self.CreateTime.strftime('%Y-%m-%d %H:%M:%S') if self.CreateTime else ''
        }

class ImageList(BaseModel):
    """
    镜像显示列表
    """
    __tablename__ = 'bk_image_list'

    ImageId = Column('fi_id', Integer, primary_key=True)
    AllImageName = Column('fs_allimagename', String(50))
    ImageName = Column('fs_imagename', String(50))
    UserName = Column('fs_username', String(50))

    def toDict(self):
        return {
            'ImageId': self.ImageId,
            'AllImageName':self.AllImageName,
            'ImageName':self.ImageName,
            'UserName':self.UserName
        }

class MirrorList(BaseModel):
    """
    三级联动镜像和
    """
    __tablename__ = 'bk_mirrorparent_list'
    MirrorId = Column('fi_id', Integer, primary_key=True)
    MirrorName = Column('fs_mirror_name', String(50))
    Level = Column('fi_level', Integer)
    Parent = Column('fi_parent', Integer)
    UserName = Column('fs_username', String(50))

    def toDict(self):
        return {
            'MirrorId': self.MirrorId,
            'MirrorName':self.MirrorName,
            'Level':self.Level,
            'Parent':self.Parent,
            'UserName':self.UserName
        }

class AppList(BaseModel):
    """
    应用显示列表
    """
    __tablename__ = "bk_app_list"
    AppId = Column('fi_id', Integer,primary_key=True)
    ImageId = Column('fi_image_id', Integer)
    AppName = Column('fs_appname', String(50))
    ImageName = Column('fs_imagename', String(50))
    RunEnvironment = Column('fs_runenvironment',String(20))
    Status = Column('fs_status',String(20))
    NodeIp = Column('fs_nodeip',String(50))
    NodePort = Column('fi_nodeport',Integer)
    Replicas = Column('fi_replicas',Integer)
    NsInfo = Column('fs_nsinfo',Text)
    RcInfo = Column('fs_rcinfo',Text)
    SeInfo = Column('fs_seinfo',Text)
    ClusterIp = Column('fs_clusterip',String(50))
    CreateUser = Column('fs_create_user', String(20))
    """:param CreateId: 创建人"""
    CreateTime = Column('ft_create_time', DateTime)
    """:param CreateTime: 创建时间"""

    def toDict(self):
        return {
            'AppId': self.AppId,
            'ImageId':self.ImageId,
            'AppName':self.AppName,
            'ImageName':self.ImageName,
            'RunEnvironment':self.RunEnvironment,
            'Status':self.Status,
            'NodeIp':self.NodeIp,
            'NodePort':self.NodePort,
            'Replicas':self.Replicas,
            'NsInfo':self.NsInfo,
            'RcInfo':self.RcInfo,
            'SeInfo':self.SeInfo,
            'ClusterIp':self.ClusterIp,
            'CreateUser': self.CreateUser,
            'CreateTime': self.CreateTime.strftime('%Y-%m-%d %H:%M:%S') if self.CreateTime else ''
        }
