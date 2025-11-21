import axios from "axios";

// axios instance:
export const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ------- KPI SUMMARY -------
export const fetchKPIs = (filters = {}) =>
  api.get("/agg/kpis", { params: filters });

// ------- FULL DASHBOARD DATA -------
export const fetchDashboard = async (filters = {}) => {
  const query = { ...filters, limit: 50, page: 1 };

  const [topic, country, years, scatter, records] = await Promise.all([
    api.get("/agg/count-by-topic", { params: filters }),
    api.get("/agg/intensity-by-country", { params: filters }),
    api.get("/agg/count-by-year", { params: filters }),
    api.get("/agg/scatter-intensity-likelihood", { params: filters }),
    api.get("/records", { params: query }), // LIMIT = 50
  ]);

  return {
    data: {
      topic: topic.data,
      country: country.data,
      years: years.data,
      scatter: scatter.data,
      records: records.data.docs,
    },
  };
};
