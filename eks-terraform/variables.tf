variable "region" {
  default = "ap-south-1"
}

variable "cluster_name" {
  default = "my-eks-cluster"
}

variable "node_group_name" {
  default = "eks-node-group"
}

variable "instance_type" {
  default = "t3.medium"
}

variable "desired_capacity" {
  default = 2
}

variable "max_size" {
  default = 5
}

variable "min_size" {
  default = 1
}
