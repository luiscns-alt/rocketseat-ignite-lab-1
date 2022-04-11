import { PurchasesService } from './../../../services/purchases.service';
import { UseGuards } from '@nestjs/common';
import {
    Parent,
    Query,
    ResolveField,
    Resolver,
    ResolveReference,
} from '@nestjs/graphql';

import { AuthUser, CurrentUser } from '../../auth/current-user';
import { AuthorizationGuard } from '../../auth/authorization.guard';
import { CustomersService } from '../../../services/customers.service';

import { Customer } from '../models/customer';

@Resolver(() => Customer)
export class CustomerResolver {
    constructor(
        private customersService: CustomersService,
        private purchaseService: PurchasesService
    ) {}

    @UseGuards(AuthorizationGuard)
    @Query(() => Customer)
    me(@CurrentUser() user: AuthUser) {
        return this.customersService.getCustomerByAuthUserId(user.sub);
    }

    @ResolveField()
    purchases(@Parent() customer: Customer) {
        return this.purchaseService.listAllFromCustomer(customer.id);
    }

    @ResolveReference()
    resolveReference(reference: { authUserId: string }) {
        return this.customersService.getCustomerByAuthUserId(
            reference.authUserId
        );
    }
}
