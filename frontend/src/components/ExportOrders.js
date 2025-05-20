import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { FiDownload, FiFileText, FiTruck, FiCheckCircle } from 'react-icons/fi';
import * as XLSX from 'xlsx';

const ExportOrders = ({ orders }) => {
  const exportToExcel = (ordersToExport, fileName) => {
    // Prepare data for Excel
    const data = ordersToExport.map(order => ({
      'Order ID': order._id,
      'Customer Name': order.customerName,
      'Email': order.email,
      'Phone': order.phone,
      'Address': `${order.address}, ${order.city}, ${order.zipCode}`,
      'Order Date': new Date(order.orderDate).toLocaleString(),
      'Products': order.products.map(p => `${p.name} (x${p.quantity})`).join(', '),
      'Total Amount': `$${order.totalAmount.toFixed(2)}`,
      'Status': order.status,
      'Payment Method': order.paymentMethod
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

    // Export the file
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const handleExportClick = (type) => {
    switch(type) {
      case 'all':
        exportToExcel(orders, 'all_orders');
        break;
      case 'delivery':
        const deliveryOrders = orders.filter(order => order.status === 'out-for-delivery');
        exportToExcel(deliveryOrders, 'delivery_orders');
        break;
      case 'completed':
        const completedOrders = orders.filter(order => order.status === 'completed');
        exportToExcel(completedOrders, 'completed_orders');
        break;
      default:
        break;
    }
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="light" className="d-flex align-items-center">
        <FiDownload className="me-1" /> Export
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => handleExportClick('all')}>
          <FiFileText className="me-2" /> All Orders
        </Dropdown.Item>
        <Dropdown.Item onClick={() => handleExportClick('delivery')}>
          <FiTruck className="me-2" /> Out for Delivery
        </Dropdown.Item>
        <Dropdown.Item onClick={() => handleExportClick('completed')}>
          <FiCheckCircle className="me-2" /> Completed Orders
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ExportOrders;