output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnet_id" {
  value = aws_subnet.public.id
}

output "public_subnet_id-2" {
  value = aws_subnet.public2.id
}

output "private_subnet_id" {
  value = aws_subnet.private.id
}

output "private_subnet_id-2" {
  value = aws_subnet.private-2.id
}

