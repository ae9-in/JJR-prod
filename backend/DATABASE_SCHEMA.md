# MongoDB Database Design

Database name:

- `jaya_janardhana`

Collections:

## `users`

Purpose:

- authentication
- affiliate/admin role management
- referral tracking

Main fields:

- `name`
- `email`
- `password`
- `contact`
- `role`
- `referralCode`
- `isActive`
- `createdAt`
- `updatedAt`

Indexes:

- unique `email`
- unique `referralCode`
- `role + isActive`

## `verticals`

Purpose:

- top-level product grouping used by the catalog

Main fields:

- `verticalId`
- `name`
- `icon`
- `description`
- `color`
- `isActive`
- `sortOrder`

Indexes:

- unique `verticalId`
- `isActive + sortOrder`

## `products`

Purpose:

- catalog items that affiliates browse and sell

Main fields:

- `verticalId`
- `name`
- `slug`
- `description`
- `price`
- `image`
- `commissionRate`
- `variants[]`
- `isActive`
- `isFeatured`
- `createdAt`
- `updatedAt`

Indexes:

- unique `slug`
- `verticalId + isActive`
- `name`

## `addresses`

Purpose:

- saved delivery addresses for each user

Main fields:

- `user`
- `label`
- `fullName`
- `mobile`
- `addressLine1`
- `addressLine2`
- `city`
- `state`
- `pincode`
- `isDefault`

Indexes:

- `user + createdAt`
- `user + isDefault`

## `orders`

Purpose:

- order placement
- order history
- margin/earnings tracking

Main fields:

- `user`
- `orderCode`
- `items[]`
- `deliveryAddress`
- `totalAmount`
- `totalEarnings`
- `payment.method`
- `payment.status`
- `payment.transactionId`
- `payment.paidAt`
- `status`
- `createdAt`
- `updatedAt`

Embedded documents:

- `items[]` stores immutable product snapshot data for order history
- `deliveryAddress` stores the address used at checkout time
- `payment` stores payment summary data

Indexes:

- unique `orderCode`
- `user + createdAt`
- `status + createdAt`

## Relationship summary

- one user can have many addresses
- one user can have many orders
- one vertical can have many products
- each order stores product snapshots in `items[]` so historical orders stay unchanged even if product data changes later

## Why this schema fits this project

- matches the current frontend pages: login/register, catalog, address, payment, order history
- supports affiliate margins using `commissionRate` and `totalEarnings`
- supports future admin features without redesigning the core collections
- keeps checkout reliable by storing order-time snapshots instead of only references
