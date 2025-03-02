import React, { use, useEffect, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


export default function Dashboard() {
    const [productsCount, setProductsCount] = useState(0)
    const [employeesCount, setEmployeesCount] = useState(0)
    const [ordersCount, setOrdersCount] = useState(0)
    const [customersCount, setCustomersCount] = useState(0)
    

    useEffect(() => {
        fetch("http://localhost:5000/products/count")
            .then(response => response.json())
            .then(productsCount => {
                const {count} = productsCount
                setProductsCount(count)
            });
        fetch("http://localhost:5000/employees/count")
            .then(response => response.json())
            .then(employeesCount => {
                const {count} = employeesCount
                setEmployeesCount(count)
            });
        fetch("http://localhost:5000/orders/count")
            .then(response => response.json())
            .then(ordersCount => {
                const {count} = ordersCount
                setOrdersCount(count)
            });
        fetch("http://localhost:5000/customers/count")
            .then(response => response.json())
            .then(customersCount => {
                const {count} = customersCount
                setCustomersCount(count)    
            });
    }, []);

    
    const data = {
        labels: ['Customers', 'Products', 'Employees', 'Orders'],
        datasets: [
            {
                label: '# of Entities',
                data: [customersCount, productsCount, employeesCount, ordersCount],
                // data: [0.3, 0.4, 0.2, 0.1],
                innerWidth: 100,
                innerHeight: 50,
                backgroundColor: [
                    'rgb(220,53,69)',
                    'rgb(47,110,253)',
                    'rgb(249,193,9)',
                    'rgb(38,135,84)',
                ],
                borderColor: [
                    'rgb(220,53,69)',
                    'rgb(47,110,253)',
                    'rgb(249,193,9)',
                    'rgb(38,135,84)',
                ],
                borderWidth: 1,
            },
        ],
    };
    return (
        // <div>Dashboard</div>
        <>
            <div class="container-fluid px-4">
                <h1 class="mt-4">Dashboard For CRM</h1>
                <ol class="breadcrumb mb-4">
                    <li class="breadcrumb-item active">Dashboard</li>
                </ol>
                <div class="row">
                    <div class="col-xl-3 col-md-6">
                        <div class="card bg-primary text-white mb-4">
                            <div class="card-body">{productsCount} Products</div>
                            <div class="card-footer d-flex align-items-center justify-content-between">
                                <a class="small text-white stretched-link" href="#">View Details</a>
                                <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6">
                        <div class="card bg-warning text-white mb-4">
                            <div class="card-body">{employeesCount} Employees</div>
                            <div class="card-footer d-flex align-items-center justify-content-between">
                                <a class="small text-white stretched-link" href="#">View Details</a>
                                <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6">
                        <div class="card bg-success text-white mb-4">
                            <div class="card-body">{ordersCount} Orders</div>
                            <div class="card-footer d-flex align-items-center justify-content-between">
                                <a class="small text-white stretched-link" href="#">View Details</a>
                                <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6">
                        <div class="card bg-danger text-white mb-4">
                            <div class="card-body">{customersCount} Customers</div>
                            <div class="card-footer d-flex align-items-center justify-content-between">
                                <a class="small text-white stretched-link" href="#">View Details</a>
                                <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xl-6">
                        <div class="card mb-4">
                            <div class="card-header">
                                <i class="fas fa-chart-area me-1"></i>
                                Area Chart Example
                            </div>
                            <div class="card-body"><canvas id="myAreaChart" width="100%" height="40"></canvas></div>
                        </div>
                    </div>
                    <div class="col-xl-6">
                        <div class="card mb-4">
                            <div class="card-header">
                                <i class="fas fa-chart-bar me-1"></i>
                                Bar Chart Example
                            </div>
                            <div class="card-body">
                                <Pie data={data} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
