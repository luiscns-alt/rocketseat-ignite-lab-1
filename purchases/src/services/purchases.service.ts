import { KafkaService } from './../messaging/kafka.service';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '../database/prisma/prisma.service';

interface CreatePurchaseParams {
    customerId: string;
    productId: string;
}

@Injectable()
export class PurchasesService {
    constructor(private prisma: PrismaService, private Kafka: KafkaService) {}

    listAllPurchases() {
        return this.prisma.purchase.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    listAllFromCustomer(customerId: string) {
        return this.prisma.purchase.findMany({
            where: {
                customerId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async createPurchase({ customerId, productId }: CreatePurchaseParams) {
        const product = await this.prisma.product.findUnique({
            where: {
                id: productId,
            },
        });

        if (!product) {
            throw new Error('Product not found.');
        }

        const purchase = await this.prisma.purchase.create({
            data: {
                customerId,
                productId,
            },
        });

        const customer = await this.prisma.customer.findUnique({
            where: { id: customerId },
        });

        this.Kafka.emit('purchases.new-purchase', {
            customer: {
                authUserId: customer.authUserId,
            },
            product: {
                id: product.id,
                title: product.title,
                slug: product.slug,
            },
        });

        return purchase;
    }
}
