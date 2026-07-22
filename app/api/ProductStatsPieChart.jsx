"use client";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { getOrders } from "@/lib/inventory-api/user";
import { listProduct } from "@/lib/inventory-api/Product";
import useEcomStore from "@/store/ecom-store";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const ProductStatsPieChart = () => {
    const [chartData, setChartData] = useState([]);
    const token = useEcomStore((state) => state.token);

    useEffect(() => {
        if (token) {
            handleGetOrders(token);
        } else {
            handleGetGlobalStats();
        }
    }, [token]);

    const handleGetGlobalStats = () => {
        listProduct(100)
            .then((res) => {
                const products = res.data;
                const formattedData = products.map((item) => ({
                    category: item.title,
                    value: item.sold,
                }));
                // Filter out products with 0 sales if desired, or keep all
                const activeData = formattedData.filter(item => item.value > 0);
                setChartData(activeData);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleGetOrders = (token) => {
        getOrders(token)
            .then((res) => {
                const orders = res.data.orders;
                processData(orders);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const processData = (orders) => {
        if (!orders || !Array.isArray(orders)) return;
        const productCount = {};

        orders.forEach((order) => {
            order.products.forEach((item) => {
                const productName = item.product.title;
                const count = item.count;

                if (productCount[productName]) {
                    productCount[productName] += count;
                } else {
                    productCount[productName] = count;
                }
            });
        });

        const formattedData = Object.keys(productCount).map((key) => ({
            category: key,
            value: productCount[key],
        }));

        setChartData(formattedData);
    };

    useLayoutEffect(() => {
        if (chartData.length === 0) return;

        let root = am5.Root.new("chartdiv");

        root.setThemes([am5themes_Animated.new(root)]);

        let chart = root.container.children.push(
            am5percent.PieChart.new(root, {
                endAngle: 270,
                layout: root.verticalLayout,
                innerRadius: am5.percent(60),
            })
        );

        let series = chart.series.push(
            am5percent.PieSeries.new(root, {
                valueField: "value",
                categoryField: "category",
                endAngle: 270,
            })
        );

        series.set("colors", am5.ColorSet.new(root, {
            colors: [
                am5.color(0x67b7dc),
                am5.color(0x6794dc),
                am5.color(0x6771dc),
                am5.color(0x8067dc),
                am5.color(0xa367dc),
                am5.color(0xc767dc),
                am5.color(0xdc67ce),
                am5.color(0xdc67ab),
                am5.color(0xdc6788),
                am5.color(0xdc6967),
                am5.color(0xdc8c67),
                am5.color(0xdcaf67),
                am5.color(0xdcd267),
                am5.color(0xc3dc67),
                am5.color(0xa0dc67),
                am5.color(0x7ddc67),
                am5.color(0x67dc75),
                am5.color(0x73556E),
                am5.color(0x67dc98),
                am5.color(0x67dcbb),
                am5.color(0x67b7dc),
                am5.color(0x9FA1A6),
                am5.color(0xF2AA6B),
                am5.color(0xF28F6B),
                am5.color(0xA95A52),
                am5.color(0xE35B5D),
                am5.color(0xFFA446)
            ]
        }));

        let gradient = am5.RadialGradient.new(root, {
            stops: [
                { color: am5.color(0x000000) },
                { color: am5.color(0x000000) },
                {}
            ]
        });

        series.slices.template.setAll({
            // fillGradient: gradient,
            strokeWidth: 2,
            stroke: am5.color(0xffffff),
            cornerRadius: 10,
            shadowOpacity: 0.1,
            shadowOffsetX: 1,
            shadowOffsetY: 1,
            tooltipText: "{category}: {valuePercentTotal.formatNumber('0.00')}% ({value} ชิ้น)",
            // shadowColor: am5.color(0x000000),
            // fillPattern: am5.GrainPattern.new(root, {
            //     maxOpacity: 0.2,
            //     density: 0.5,
            //     colors: [am5.color(0x000000)]
            // })
        });

        series.slices.template.states.create("hover", {
            shadowOpacity: 1,
            shadowBlur: 10
        });

        series.ticks.template.setAll({
            strokeOpacity: 0.4,
            strokeDasharray: [2, 2]
        });

        series.states.create("hidden", {
            endAngle: -90
        });

        series.data.setAll(chartData);

        // Debug: Check data length
        console.log("Chart Data Length:", chartData.length);

        let legend = chart.children.push(am5.Legend.new(root, {
            centerX: am5.percent(50),
            x: am5.percent(50),
            marginTop: 15,
            marginBottom: 15,
            height: am5.percent(50),
            verticalScrollbar: am5.Scrollbar.new(root, {
                orientation: "vertical"
            })
        }));

        legend.markerRectangles.template.adapters.add("fillGradient", function () {
            return undefined;
        });

        legend.data.setAll(series.dataItems);

        series.appear(1000, 100);

        return () => {
            root.dispose();
        };
    }, [chartData]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border mt-6">
            <h2 className="text-xl font-bold mb-4 text-center">สรุปยอดเบิกรายสินค้าทั้งหมด</h2>
            <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
        </div>
    );
};

export default ProductStatsPieChart;

