#Custome VPC
resource "aws_vpc" "main" {
  cidr_block       = "10.0.0.0/16"
  instance_tenancy = "default"

  tags = {
    Name = "main"
  }
}

#Public Subnet
resource "aws_subnet" "public" {
  vpc_id                           = aws_vpc.main.id
  cidr_block                       = "10.0.1.0/24"
  availability_zone                = "us-west-1a"
  map_public_ip_on_launch          = true
  tags                             = {Name = "public_subnet"}
}

#Internet Gateway attached to VPC
resource "aws_internet_gateway" "igw" {
  vpc_id                           = aws_vpc.main.id
  tags                             = {Name = "IGW"}
}

resource "aws_route_table" "rt1" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = { Name = "Public_route" }
}



#Private subnet for private servers
resource "aws_subnet" "private" {
  vpc_id                           = aws_vpc.main.id
  cidr_block                       = "10.0.2.0/24"
  availability_zone                  = "us-west-1c"
  tags                             = {Name = "private_subnet"}
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
