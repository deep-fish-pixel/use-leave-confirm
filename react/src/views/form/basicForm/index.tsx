import { Button, Form, Input, Select, Space, message } from "antd";
import "./index.less";
// import {useNavigate} from "react-router-dom";
// import {useEffect} from "react";
import {useLeaveConfirm} from "@/utils";
import {useNavigate} from "react-router-dom";

const BasicForm = () => {
	const { Option } = Select;
	const [form] = Form.useForm();
	const navigate = useNavigate();

	const {snapshot} = useLeaveConfirm(() => form.getFieldsValue(), {
		navigate,
	});

	// const navigate = useNavigate();
	//
	// useEffect(()=>{
	// 	setTimeout(() => {
	// 		debugger
	// 		navigate('/form/validateForm');
	// 		debugger
	// 	}, 1000);
	// }, [])


	const onGenderChange = (value: string) => {
		switch (value) {
			case "male":
				form.setFieldsValue({ note: "Hi, man!" });
				return;
			case "female":
				form.setFieldsValue({ note: "Hi, lady!" });
				return;
			case "other":
				form.setFieldsValue({ note: "Hi there!" });
		}
	};

	const onFinish = (values: any) => {
		message.success("提交的数据为 : " + JSON.stringify(values));
		console.log(JSON.stringify(values));
		snapshot();
	};

	const onReset = () => {
		form.resetFields();
		snapshot();
	};

	const onFill = () => {
		form.setFieldsValue({
			user: "mark",
			note: "Hello world!",
			gender: "male"
		});
	};

	return (
		<div className="card content-box">
			<Form form={form} name="control-hooks" onFinish={onFinish} labelCol={{ span: 1 }}>
				<Form.Item name="user" label="User">
					<Input placeholder="Please enter a user" />
				</Form.Item>
				<Form.Item name="note" label="Note">
					<Input placeholder="Please enter a user note" />
				</Form.Item>
				<Form.Item name="gender" label="Gender">
					<Select placeholder="Select a option and change input text above" onChange={onGenderChange} allowClear>
						<Option value="male">male</Option>
						<Option value="female">female</Option>
						<Option value="other">other</Option>
					</Select>
				</Form.Item>
				<Form.Item wrapperCol={{ offset: 1 }}>
					<Space>
						<Button type="primary" htmlType="submit">
							Submit
						</Button>
						<Button htmlType="button" onClick={onReset}>
							Reset
						</Button>
						<Button type="link" htmlType="button" onClick={onFill}>
							Fill form
						</Button>{" "}
					</Space>
				</Form.Item>
			</Form>
		</div>
	);
};

export default BasicForm;
