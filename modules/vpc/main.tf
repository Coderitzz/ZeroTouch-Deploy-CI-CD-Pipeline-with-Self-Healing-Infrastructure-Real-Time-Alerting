#Custome VPC
resource "aws_vpc" "main" {
  cidr_block       = "10.0.0.0/16"
  instance_tenancy = "default"

  tags = {
    Name = "main"
  }
}

#Public Subnet-1
resource "aws_subnet" "public" {
  vpc_id                           = aws_vpc.main.id
  cidr_block                       = "10.0.1.0/24"
  availability_zone                = "us-west-1a"
  map_public_ip_on_launch          = true
  tags                             = {Name = "public_subnet-1"}
}

#public subnet-2
resource "aws_subnet" "public2" {
  vpc_id                           = aws_vpc.main.id
  cidr_block                       = "10.0.3.0/24"
  availability_zone                = "us-west-1c"
  map_public_ip_on_launch          = true
  tags                             = {Name = "public_subnet-2"}
}

#Internet Gateway attached to VPC
resource "aws_internet_gateway" "igw" {
  vpc_id                           = aws_vpc.main.id
  tags                             = {Name = "IGW"}
}

#Route Table - 1
resource "aws_route_table" "rt1" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = { Name = "Public_route" }
}


#Public subnet association
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.rt1.id
}

#public subnet association-2
resource "aws_route_table_association" "public2" {
  subnet_id      = aws_subnet.public2.id
  route_table_id = aws_route_table.rt1.id
}

#Private subnet for private servers
resource "aws_subnet" "private" {
  vpc_id                           = aws_vpc.main.id
  cidr_block                       = "10.0.2.0/24"
  availability_zone                = "us-west-1c"
  tags                             = {Name = "private_subnet-1"}
}

#Private subnet-2
resource "aws_subnet" "private-2" {
  vpc_id                          = aws_vpc.main.id
  cidr_block                      = "10.0.4.0/24"
  availability_zone               = "us-west-1a"
  tags                            = {Name = "private_subnet-2"}  
}

#Allocation of EIP for NAT Gateway.
resource "aws_eip" "nat" {
  domain     = "vpc"
  depends_on = [aws_internet_gateway.igw]

  tags = {
    Name = "main-nat-eip"
  }
}

#Creation of NAT Gateway
resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public.id
  tags = {
    Name = "main-nat-gateway"
  }

  depends_on = [aws_internet_gateway.igw]
}

#Route Table for the Private Subnet
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main.id
  }

  tags = {
    Name = "private-route-table"
  }
}

#Associate the Private Subnet with the Private Route Table
resource "aws_route_table_association" "private" {
  subnet_id      = aws_subnet.private.id
  route_table_id = aws_route_table.private.id
}

#Private subnet Association-2
resource "aws_route_table_association" "private2" {
  subnet_id      = aws_subnet.private-2.id
  route_table_id = aws_route_table.private.id
}
