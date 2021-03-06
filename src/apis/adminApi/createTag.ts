import AdminApi from ".";

interface Body {
  name: string;
  tag_category_id: number | string;
}

const createTag = async (body: Body) => {
  try {
    const { data } = await AdminApi.post<{ tags: DTOS.Output.Tag[] }>("/tag", body);
    return data.tags;
  } catch (error) {
    throw error;
  }
};

export default createTag;
