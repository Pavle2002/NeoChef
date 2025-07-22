import { DateTime } from "neo4j-driver";

function toStandardDate(neo4jDate: DateTime) {
  const dateNumber = Date.parse(neo4jDate.toString());
  const nativeDate = new Date(dateNumber);
  return nativeDate;
}

function toNeo4jDateTime(nativeDate: Date) {
  const neo4jDateTime = DateTime.fromStandardDate(nativeDate);
  return neo4jDateTime;
}

export const neo4jDateTimeConverter = {
  toStandardDate,
  toNeo4jDateTime,
};
