"use client";

import Image from "next/image";
import React from "react";

import { CustomerListModel, WithTotal } from "@vivid/types";
import { Skeleton, toast } from "..";
import {
  AsyncFilterBoxOption,
  AsyncFilterBoxProps,
  DataTableAsyncFilterBox,
} from "./data-table-async-filter-box";

const CustomerShortLabel: React.FC<{
  customer: CustomerListModel;
}> = ({ customer }) => {
  return (
    <div className="flex flex-row items-center gap-2 shrink overflow-hidden text-nowrap">
      <Image
        src={customer.avatar ?? "/unknown-person.png"}
        width={20}
        height={20}
        alt={customer.name}
      />
      <div className="flex gap-0.5 flex-col">
        <span>{customer.name}</span>
        <span className="text-xs italic">{customer.email}</span>
        <span className="text-xs italic">{customer.phone}</span>
      </div>
    </div>
  );
};

const CustomerLoader: React.FC<{}> = ({}) => {
  return (
    <div className="flex flex-row items-center gap-2 overflow-hidden text-nowrap pl-6">
      <Skeleton className="w-5 h-5 rounded-full" />
      <div className="flex gap-0.5 flex-col">
        <Skeleton className="w-40 h-5" />
        <Skeleton className="w-36 h-4" />
        <Skeleton className="w-36 h-4" />
      </div>
    </div>
  );
};

export const CustomersDataTableAsyncFilterBox: React.FC<
  Omit<AsyncFilterBoxProps, "fetchItems" | "title" | "filterKey" | "loader"> & {
    title?: AsyncFilterBoxProps["title"];
    filterKey?: AsyncFilterBoxProps["filterKey"];
  }
> = ({ title = "Customer", filterKey = "customerId", ...rest }) => {
  const getCustomers = async (page: number, search?: string) => {
    const limit = 10;
    let url = `/admin/api/customers?page=${page}&limit=${limit}`;
    if (rest.filterValue) {
      url += `&priorityId=${rest.filterValue.map((id) => encodeURIComponent(id)).join(",")}`;
    }

    if (search) url += `&search=${encodeURIComponent(search)}`;

    const response = await fetch(url, {
      method: "GET",
      cache: "default",
    });

    if (response.status >= 400) {
      toast.error("Request failed.");
      const text = await response.text();
      console.error(
        `Request to fetch customers failed: ${response.status}; ${text}`
      );

      return {
        items: [],
        hasMore: false,
      };
    }

    const res = (await response.json()) as WithTotal<CustomerListModel>;

    return {
      items: res.items.map((customer) => ({
        label: <CustomerShortLabel customer={customer} />,
        shortLabel: customer.name,
        value: customer._id,
      })) satisfies AsyncFilterBoxOption[],
      hasMore: page * limit < res.total,
    };
  };

  return (
    <DataTableAsyncFilterBox
      title={title}
      filterKey={filterKey}
      fetchItems={getCustomers}
      {...rest}
      loader={<CustomerLoader />}
    />
  );
};
