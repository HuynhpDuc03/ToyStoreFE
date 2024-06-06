import { Table } from 'antd';
import React from 'react'

const TableComponent = (props) => {
    const { selectionType = 'checkbox', data = [], columns = [] } = props

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            name: record.name,
        }),
    };

    return (
        <Table
            rowSelection={{
                type: selectionType,
                ...rowSelection,
            }}
            columns={columns}
            dataSource={data}
            {...props}
        />
    )
}

export default TableComponent