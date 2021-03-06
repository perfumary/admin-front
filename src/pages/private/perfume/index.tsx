import getAllPerfumesData from "Apis/adminApi/getAllPerfumes";
import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const PerfumeList: React.FC = () => {
  const navigate = useNavigate();
  const [perfumes, setPerfumes] = useState<DTOS.Output.Perfume[]>([]);
  const handleAddBtn = () => {
    navigate("/perfume/add");
  };
  console.log("test");
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getAllPerfumesData();
        setPerfumes(data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);
  const tableHeader: { label: string; render: (perfume: DTOS.Output.Perfume, idx: number) => ReactNode }[] = [
    {
      label: "No.",
      render: (item, idx) => idx + 1,
    },
    {
      label: "이름(한글)",
      render: (item) => item.kor,
    },
    {
      label: "이름(영어)",
      render: (item) => item.eng,
    },
    {
      label: "용량(ml)",
      render: (item) => item.capacity,
    },
    {
      label: "브랜드",
      render: (item) => item.brand.kor,
    },
    {
      label: "농도",
      render: (item) => item.density.name,
    },
    {
      label: "어코드",
      render: (item) =>
        item.perfume_accords
          .filter((el, idx) => idx < 3)
          .map((el) => el.accord.kor)
          .join(", "),
    },
    {
      label: "노트",
      render: (item) => {
        if (item.is_single) {
          return (
            <div>
              <p>
                싱글노트:{" "}
                {item.perfume_notes
                  .filter((note) => note.type === "S")
                  .map((el) => el.note.kor)
                  .join(", ")}
              </p>
            </div>
          );
        }
        return (
          <div>
            <p>
              탑노트:{" "}
              {item.perfume_notes
                .filter((note) => note.type === "T")
                .map((el) => el.note.kor)
                .join(", ")}
            </p>
            <p>
              미들노트:{" "}
              {item.perfume_notes
                .filter((note) => note.type === "M")
                .map((el) => el.note.kor)
                .join(", ")}
            </p>
            <p>
              베이스노트:{" "}
              {item.perfume_notes
                .filter((note) => note.type === "B")
                .map((el) => el.note.kor)
                .join(", ")}
            </p>
          </div>
        );
      },
    },
  ];
  return (
    <Content>
      <Header>
        <h2>향수 리스트</h2>
        <button className="add-perfume" onClick={handleAddBtn}>
          향수 추가하기
        </button>
      </Header>
      <Table>
        <colgroup>
          {tableHeader.map((el, idx) => (
            <col key={`col_${idx}`} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {tableHeader.map((el, idx) => (
              <th key={`head_${idx}`}>{el.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {perfumes.length > 0 &&
            perfumes.map((perfume, perfumeIdx) => (
              <tr key={`perfume_${perfume.id}`}>
                {tableHeader.map((el, idx) => (
                  <td key={`perfume_${perfume.id}_${idx}`}>{el.render(perfume, perfumeIdx)}</td>
                ))}
              </tr>
            ))}
          {perfumes.length === 0 && (
            <tr>
              <td colSpan={8}>입력된 향수가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Content>
  );
};

export default PerfumeList;

const Content = styled.main`
  padding: 40px;
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .add-perfume {
    padding: 12px 8px;
    background: ${(p) => p.theme.color.perfumery_pink};
    color: white;
    border-radius: 3px;
  }
`;
const Table = styled.table`
  width: 100%;
  margin: 30px 0;

  border-collapse: collapse;
  th,
  td {
    border: 1px solid #444444;
    padding: 12px 0;
    text-align: center;
  }
`;
