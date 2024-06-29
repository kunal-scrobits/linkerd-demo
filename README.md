
# MERN Stack with Linkerd Service Mesh

This guide provides instructions for setting up a MERN stack application secured and managed by Linkerd service mesh.

## Prerequisites

- Kubernetes cluster (e.g., Minikube, GKE, EKS, etc.)
- `kubectl` command-line tool
- Docker installed and configured
- Linkerd CLI installed

## Instructions

### 1. Install Linkerd

#### 1.1 Install Linkerd CLI

```bash
curl -sL https://run.linkerd.io/install | sh
export PATH=$PATH:$HOME/.linkerd2/bin
```

#### 1.2 Validate Your Kubernetes Cluster

```bash
linkerd check --pre
```

#### 1.3 Install Linkerd Control Plane

```bash
# install the CRDs first
linkerd install --crds | kubectl apply -f -

# install the Linkerd control plane once the CRDs have been installed
linkerd install | kubectl apply -f -
```

#### 1.4 Verify Installation

```bash
linkerd check
```

#### 1.5 Label the Namespace for Auto-Injection

```bash
kubectl create namespace todo
kubectl label namespace todo linkerd.io/inject=enabled
```


### 2. Apply the Kubernetes Manifests

```bash
kubectl apply -f mongo.yaml -n todo
kubectl apply -f backend.yaml -n todo
kubectl apply -f frontend.yaml -n todo
```

#### 3 Inject Linkerd Sidecars into Existing Deployments

```bash
kubectl get deploy -n todo -o yaml | linkerd inject - | kubectl apply -f -
```

### 4. Access the Linkerd Dashboard

#### 4.1 Install Linkerd Viz Extension

```bash
linkerd viz install | kubectl apply -f -
```

#### 4.2 Launch the Linkerd Dashboard

```bash
linkerd viz dashboard &
```
This command will open the Linkerd dashboard in your default web browser. If it does not, you can manually open it by navigating to `http://localhost:50750`.

#### 4.3 Generate load to our backend app

```bash
kubectl run -i --tty load-generator --image=busybox -n todo --restart=Never --rm -- /bin/sh -c "while true; do wget -qO- http://backend:5000/todos; done"
```