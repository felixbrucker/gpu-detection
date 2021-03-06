extern crate fil_ocl_core as core;

use crate::core::{ DeviceInfo, PlatformInfo, Status };
use neon::prelude::*;

// convert the info or error to a string
macro_rules! to_string {
    ($expr:expr) => {
        match $expr {
            Ok(info) => info.to_string(),
            Err(err) => match err.api_status() {
                Some(Status::CL_KERNEL_ARG_INFO_NOT_AVAILABLE) => "Not available".into(),
                _ => err.to_string(),
            },
        }
    };
}

fn get_platform_info(mut cx: FunctionContext) -> JsResult<JsArray> {
    let mut platform_infos: Vec<Handle<JsObject>> = Vec::new();
    let platform_ids = core::get_platform_ids().unwrap();
    for (i, platform_id) in platform_ids.iter().enumerate() {
        let platform_info = JsObject::new(&mut cx);
        let js_platform_id = cx.number(i as f64);
        let js_platform_name = cx.string(&to_string!(core::get_platform_info(&platform_id, PlatformInfo::Name)));
        let js_platform_version = cx.string(&to_string!(core::get_platform_info(&platform_id, PlatformInfo::Version)));
        platform_info.set(&mut cx, "id", js_platform_id).unwrap();
        platform_info.set(&mut cx, "name", js_platform_name).unwrap();
        platform_info.set(&mut cx, "version", js_platform_version).unwrap();

        let mut device_infos: Vec<Handle<JsObject>> = Vec::new();
        let device_ids = core::get_device_ids(&platform_id, None, None).unwrap();
        for (j, device_id) in device_ids.iter().enumerate() {
            let device_info = JsObject::new(&mut cx);
            let js_device_id = cx.number(j as f64);
            let js_device_name = cx.string(&to_string!(core::get_device_info(device_id, DeviceInfo::Name)));
            let js_device_vendor = cx.string(&to_string!(core::get_device_info(device_id, DeviceInfo::Vendor)));
            let js_device_type = cx.string(&to_string!(core::get_device_info(device_id, DeviceInfo::Type)));
            let js_device_cores = cx.number(get_cores(*device_id) as f64);
            let js_device_memory = cx.string(get_memory(*device_id).to_string());
            device_info.set(&mut cx, "id", js_device_id).unwrap();
            device_info.set(&mut cx, "name", js_device_name).unwrap();
            device_info.set(&mut cx, "vendor", js_device_vendor).unwrap();
            device_info.set(&mut cx, "type", js_device_type).unwrap();
            device_info.set(&mut cx, "cores", js_device_cores).unwrap();
            device_info.set(&mut cx, "memory", js_device_memory).unwrap();

            device_infos.push(device_info);
        }
        let js_device_infos = JsArray::new(&mut cx, device_infos.len() as u32);
        for (pos, e) in device_infos.iter().enumerate() {
            js_device_infos.set(&mut cx, pos as u32, *e).unwrap();
        }
        platform_info.set(&mut cx, "devices", js_device_infos).unwrap();
        platform_infos.push(platform_info);
    }

    let js_platform_infos = JsArray::new(&mut cx, platform_infos.len() as u32);
    for (pos, e) in platform_infos.iter().enumerate() {
        js_platform_infos.set(&mut cx, pos as u32, *e).unwrap();
    }

    Ok(js_platform_infos)
}

fn get_cores(device: core::DeviceId) -> u32 {
    match core::get_device_info(device, DeviceInfo::MaxComputeUnits).unwrap() {
        core::DeviceInfoResult::MaxComputeUnits(mcu) => mcu,
        _ => panic!("Unexpected error"),
    }
}

fn get_memory(device: core::DeviceId) -> u64 {
    match core::get_device_info(device, DeviceInfo::GlobalMemSize).unwrap() {
        core::DeviceInfoResult::GlobalMemSize(mem) => mem,
        _ => panic!("Unexpected error"),
    }
}

register_module!(mut cx, {
    cx.export_function("get_platform_info", get_platform_info)
});
