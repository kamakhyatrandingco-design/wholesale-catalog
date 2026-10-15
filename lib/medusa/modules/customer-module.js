/**
 * Medusa Customer Module
 * Handles B2B customer accounts, customer groups, credit terms, and GSTIN verification.
 */

import { DefaultCustomerGroups } from '../types.js';

class CustomerModule {
  constructor() {
    this.groups = new Map(DefaultCustomerGroups.map(g => [g.id, { ...g }]));
    this.customers = new Map();
    this.initSampleCustomers();
  }

  initSampleCustomers() {
    const sampleCustomers = [
      {
        id: 'cust_01',
        company_name: 'Vogue Boutique Jaipur',
        contact_person: 'Pooja Sharma',
        phone: '+91 98290 12345',
        email: 'orders@voguejaipur.in',
        city: 'Jaipur, Rajasthan',
        gstin: '08ABCDE1234F1Z5',
        group_id: 'grp_gold_wholesalers',
        credit_limit: 250000,
        total_orders_placed: 14,
        lifetime_value: 840000,
        status: 'verified'
      },
      {
        id: 'cust_02',
        company_name: 'Surat Textiles Wholesale Hub',
        contact_person: 'Rajesh Patel',
        phone: '+91 98795 67890',
        email: 'sales@surattextileshub.com',
        city: 'Surat, Gujarat',
        gstin: '24AABCS9876G1Z2',
        group_id: 'grp_diamond_distributors',
        credit_limit: 1000000,
        total_orders_placed: 29,
        lifetime_value: 3450000,
        status: 'verified'
      },
      {
        id: 'cust_03',
        company_name: 'Guwahati Ethnic Emporium',
        contact_person: 'Ananya Barua',
        phone: '+91 94350 44556',
        email: 'ananya@guwahatithreads.com',
        city: 'Guwahati, Assam',
        gstin: '18AAEFG5566H1Z9',
        group_id: 'grp_retail_boutiques',
        credit_limit: 100000,
        total_orders_placed: 6,
        lifetime_value: 195000,
        status: 'verified'
      },
      {
        id: 'cust_04',
        company_name: 'Chandni Chowk Saree Palace',
        contact_person: 'Amit Gupta',
        phone: '+91 98110 54321',
        email: 'amit@ccpalace.com',
        city: 'Delhi, NCR',
        gstin: '07AAACR1234A1ZA',
        group_id: 'grp_gold_wholesalers',
        credit_limit: 500000,
        total_orders_placed: 19,
        lifetime_value: 1420000,
        status: 'verified'
      }
    ];

    sampleCustomers.forEach(c => this.customers.set(c.id, c));
  }

  listCustomers() {
    return Array.from(this.customers.values());
  }

  listCustomerGroups() {
    return Array.from(this.groups.values());
  }

  getCustomer(id) {
    return this.customers.get(id);
  }

  createCustomer({
    company_name,
    contact_person,
    phone,
    email,
    city,
    gstin,
    group_id = 'grp_retail_boutiques',
    credit_limit = 50000
  }) {
    const id = `cust_${Date.now()}`;
    const newCustomer = {
      id,
      company_name,
      contact_person,
      phone,
      email,
      city,
      gstin: gstin || 'URP',
      group_id,
      credit_limit: Number(credit_limit),
      total_orders_placed: 0,
      lifetime_value: 0,
      status: 'pending_verification',
      created_at: new Date().toISOString()
    };
    this.customers.set(id, newCustomer);
    return newCustomer;
  }
}

export const customerModule = new CustomerModule();
