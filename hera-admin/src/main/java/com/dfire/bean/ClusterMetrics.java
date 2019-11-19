package com.dfire.bean;

/**
 * @ClassName ClusterMetrics
 * @Description TODO
 * @Author lenovo
 * @Date 2019/8/7 10:26
 **/
public class ClusterMetrics {
    private  String  appsSubmitted;
    private  String  appsCompleted;
    private  String  appsPending;
    private  String  appsRunning;
    private  String  appsFailed;
    private  String  appsKilled;
    private  String  reservedMB;
    private  String  availableMB;
    private  String  allocatedMB;
    private  String  reservedVirtualCores;
    private  String  availableVirtualCores;
    private  String  allocatedVirtualCores;
    private  String  containersAllocated;
    private  String  containersReserved;
    private  String  containersPending;
    private  String  totalMB;
    private  String  totalVirtualCores;
    private  String  totalNodes;
    private  String  lostNodes;
    private  String  unhealthyNodes;
    private  String  decommissioningNodes;
    private  String  decommissionedNodes;
    private  String  rebootedNodes;
    private  String  activeNodes;

    public String getAppsSubmitted() {
        return appsSubmitted;
    }

    public void setAppsSubmitted(String appsSubmitted) {
        this.appsSubmitted = appsSubmitted;
    }

    public String getAppsCompleted() {
        return appsCompleted;
    }

    public void setAppsCompleted(String appsCompleted) {
        this.appsCompleted = appsCompleted;
    }

    public String getAppsPending() {
        return appsPending;
    }

    public void setAppsPending(String appsPending) {
        this.appsPending = appsPending;
    }

    public String getAppsRunning() {
        return appsRunning;
    }

    public void setAppsRunning(String appsRunning) {
        this.appsRunning = appsRunning;
    }

    public String getAppsFailed() {
        return appsFailed;
    }

    public void setAppsFailed(String appsFailed) {
        this.appsFailed = appsFailed;
    }

    public String getAppsKilled() {
        return appsKilled;
    }

    public void setAppsKilled(String appsKilled) {
        this.appsKilled = appsKilled;
    }

    public String getReservedMB() {
        return reservedMB;
    }

    public void setReservedMB(String reservedMB) {
        this.reservedMB = reservedMB;
    }

    public String getAvailableMB() {
        return availableMB;
    }

    public void setAvailableMB(String availableMB) {
        this.availableMB = availableMB;
    }

    public String getAllocatedMB() {
        return allocatedMB;
    }

    public void setAllocatedMB(String allocatedMB) {
        this.allocatedMB = allocatedMB;
    }

    public String getReservedVirtualCores() {
        return reservedVirtualCores;
    }

    public void setReservedVirtualCores(String reservedVirtualCores) {
        this.reservedVirtualCores = reservedVirtualCores;
    }

    public String getAvailableVirtualCores() {
        return availableVirtualCores;
    }

    public void setAvailableVirtualCores(String availableVirtualCores) {
        this.availableVirtualCores = availableVirtualCores;
    }

    public String getAllocatedVirtualCores() {
        return allocatedVirtualCores;
    }

    public void setAllocatedVirtualCores(String allocatedVirtualCores) {
        this.allocatedVirtualCores = allocatedVirtualCores;
    }

    public String getContainersAllocated() {
        return containersAllocated;
    }

    public void setContainersAllocated(String containersAllocated) {
        this.containersAllocated = containersAllocated;
    }

    public String getContainersReserved() {
        return containersReserved;
    }

    public void setContainersReserved(String containersReserved) {
        this.containersReserved = containersReserved;
    }

    public String getContainersPending() {
        return containersPending;
    }

    public void setContainersPending(String containersPending) {
        this.containersPending = containersPending;
    }

    public String getTotalMB() {
        return totalMB;
    }

    public void setTotalMB(String totalMB) {
        this.totalMB = totalMB;
    }

    public String getTotalVirtualCores() {
        return totalVirtualCores;
    }

    public void setTotalVirtualCores(String totalVirtualCores) {
        this.totalVirtualCores = totalVirtualCores;
    }

    public String getTotalNodes() {
        return totalNodes;
    }

    public void setTotalNodes(String totalNodes) {
        this.totalNodes = totalNodes;
    }

    public String getLostNodes() {
        return lostNodes;
    }

    public void setLostNodes(String lostNodes) {
        this.lostNodes = lostNodes;
    }

    public String getUnhealthyNodes() {
        return unhealthyNodes;
    }

    public void setUnhealthyNodes(String unhealthyNodes) {
        this.unhealthyNodes = unhealthyNodes;
    }

    public String getDecommissioningNodes() {
        return decommissioningNodes;
    }

    public void setDecommissioningNodes(String decommissioningNodes) {
        this.decommissioningNodes = decommissioningNodes;
    }

    public String getDecommissionedNodes() {
        return decommissionedNodes;
    }

    public void setDecommissionedNodes(String decommissionedNodes) {
        this.decommissionedNodes = decommissionedNodes;
    }

    public String getRebootedNodes() {
        return rebootedNodes;
    }

    public void setRebootedNodes(String rebootedNodes) {
        this.rebootedNodes = rebootedNodes;
    }

    public String getActiveNodes() {
        return activeNodes;
    }

    public void setActiveNodes(String activeNodes) {
        this.activeNodes = activeNodes;
    }
}
