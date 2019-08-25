import { InstancesDataProvider } from "../InstancesDataProvider";

export const refreshInstancesHandler = async (instanceDataProvider: InstancesDataProvider) => instanceDataProvider.refresh()