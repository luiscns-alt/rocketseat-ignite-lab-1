import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import path from 'node:path';

import { DatabaseModule } from '../database/database.module';
import { CustomersService } from '../services/customers.service';
import { PurchasesService } from '../services/purchases.service';
import { ProductsService } from './../services/products.service';
import { CustomerResolver } from './graphql/resolvers/customers.resolver';
import { ProductsResolver } from './graphql/resolvers/products.resolver';
import { PurchasesResolver } from './graphql/resolvers/purchases.resolver';

@Module({
    imports: [
        ConfigModule.forRoot(),
        DatabaseModule,
        GraphQLModule.forRoot({
            driver: ApolloDriver,
            autoSchemaFile: path.resolve(process.cwd(), 'src/schema.gql'),
        }),
    ],
    providers: [
        ProductsResolver,
        PurchasesResolver,
        CustomerResolver,

        ProductsService,
        PurchasesService,
        CustomersService,
    ],
})
export class HttpModule {}
