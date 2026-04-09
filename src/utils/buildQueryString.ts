export type QueryParams = Record<string, string | number | boolean | undefined | null>;

export const buildQueryString = (params: QueryParams): string => {
     const query = new URLSearchParams();

     Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
               query.append(key, String(value));
          }
     });

     return query.toString();
};


// use example

// const query = buildQueryString({
//   search,
//   categoryId,
//   page,
//   limit,
//   sortBy,
//   sortOrder,
// });