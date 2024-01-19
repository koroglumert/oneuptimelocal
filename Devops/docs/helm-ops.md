# Important helm commands.

Please run these commands from `root`

Make sure to use the right kubernetes context before making any changes

```
kubectl config get-contexts

# replace NAME with the context name
kubectl config use-context NAME
```

### Lint chart

```
helm lint ./HelmChart/Public/oneuptime
```

### Install as an Enterprise Cluster with default values

```
helm install oneuptime-release./HelmChart/Public/oneuptime --namespace default
```

### Install on staging

```
helm install -f ./HelmChart/Public/oneuptime/values.yaml -f ./kubernetes/values-saas-staging.yaml oneuptime-release./HelmChart/Public/oneuptime --namespace default
```

### Install on production

```
helm install -f ./HelmChart/Public/oneuptime/values.yaml -f ./Kubernetes/values-saas-production.yaml oneuptime-release./HelmChart/Public/oneuptime --namespace default
```

### Update Cluster

Staging:

```
kubectl config use-context arn:aws:eks:us-east-2:972164494713:cluster/oneuptime-staging
helm upgrade -f ./HelmChart/Public/oneuptime/values.yaml -f ./kubernetes/values-saas-staging.yaml oneuptime-release./HelmChart/Public/oneuptime
```

Use default values first and then use staging values.

Production:

```
kubectl config use-context arn:aws:eks:us-east-2:972164494713:cluster/oneuptime-production
helm upgrade -f ./HelmChart/Public/oneuptime/values.yaml -f ./Kubernetes/values-saas-production.yaml oneuptime-release./HelmChart/Public/oneuptime
```

Use default values first and then use production values.

If you introduce values, you can set

```
helm upgrade --reuse-values --set key=value oneuptime-release./HelmChart/Public/oneuptime
```

### Uninstall

```
helm uninstall oneuptime-release--namespace=default
```

### Docker build and push to docker repo with `:test` tag

Build and deploy all (with master tag, you can use any other tag):

```
chmod +x ./ci/scripts/docker-build-all-and-push.sh
sudo ./ci/scripts/docker-build-all-and-push.sh latest
```

Build and deploy one:

```
chmod +x ./ci/scripts/docker-build-and-push.sh
sudo ./ci/scripts/docker-build-and-push.sh $repo $tag
```

### Package and deploy helm chart

```
cd ./HelmChart/Public
helm repo index ./oneuptime
helm package ./oneuptime
helm repo index .
cd ..
cd ..
```

### Update a chart dependency

```
cd ./HelmChart/Public
#IMPORTANT: change the version of the dependent chart at `/HelmChart/Public/oneuptime/Chart.yaml`. This should be the version field (and NOT appVersion) in Chart.yaml of the dependency.

# Run this command.
helm dependency update oneuptime

# Go back to root.
cd ..
cd..
```

### Docker Images

Docker Images are hosted at: https://hub.docker.com/orgs/oneuptime/repositories and are public.

### More info

Read readme at [./Public/oneuptime/Readme.md](./Public/oneuptime/Readme.md)
