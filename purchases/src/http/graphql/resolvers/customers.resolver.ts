import { PurchasesService } from './../../../services/purchases.service';
import { UseGuards } from '@nestjs/common';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { AuthUser, CurrentUser } from '../../auth/current-user';
import { AuthorizationGuard } from '../../auth/authorization.guard';
import { CustomersService } from '../../../services/customers.service';

import { Customer } from '../models/customer';

@Resolver(() => Customer)
export class CustomerResolver {
    constructor(
        private customerService: CustomersService,
        private purchaseService: PurchasesService
    ) {}

    @UseGuards(AuthorizationGuard)
    @Query(() => Customer)
    me(@CurrentUser() user: AuthUser) {
        return this.customerService.getCustomerByAuthUserId(user.sub);
    }

    @ResolveField()
    purchases(@Parent() customer: Customer) {
        return this.purchaseService.listAllFromCustomer(customer.id);
    }
}
