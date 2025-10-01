import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server";

export const searchParamsCache = createSearchParamsCache({
  // filterFlag: parseAsStringEnum(
  //   flagConfig.featureFlags.map((flag) => flag.value),
  // ),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  modelYear: parseAsString.withDefault(''),
  vehicle_class: parseAsString.withDefault(''),
  // sort: getSortingStateParser<Task>().withDefault([
  //   { id: "createdAt", desc: true },
  // ]),
  // title: parseAsString.withDefault(""),
  // status: parseAsArrayOf(z.enum(tasks.status.enumValues)).withDefault([]),
  // priority: parseAsArrayOf(z.enum(tasks.priority.enumValues)).withDefault([]),
  // estimatedHours: parseAsArrayOf(z.coerce.number()).withDefault([]),
  // createdAt: parseAsArrayOf(z.coerce.number()).withDefault([]),
  // // advanced filter
  // filters: getFiltersStateParser().withDefault([]),
  // joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});