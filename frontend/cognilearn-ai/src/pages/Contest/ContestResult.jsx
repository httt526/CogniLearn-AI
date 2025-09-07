import {
  Modal,
  Title,
  Text,
  Group,
  Badge,
  Card,
  Tabs,
} from "@mantine/core";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const ContestResult = ({ opened, onClose, result }) => {
  if (!result) return null;

  const { analysis_report } = result;
  const structured = analysis_report?.structured_data_report || {};

  // Chuẩn hóa dữ liệu cho biểu đồ
  const topicData = structured.topicPerformance
  ? Object.entries(structured.topicPerformance).map(([topic, data]) => ({
      topic: data.notes,
      accuracy:
        (parseFloat(data.accuracy) <= 1
          ? parseFloat(data.accuracy) * 100
          : parseFloat(data.accuracy)) ||
        (parseFloat(data.accuracyRate) <= 1
          ? parseFloat(data.accuracyRate) * 100
          : parseFloat(data.accuracyRate)),
    }))
  : [];


  return (
      <Tabs defaultValue="overview">
        <Tabs.List grow>
          <Tabs.Tab value="overview">Tổng quan</Tabs.Tab>
          <Tabs.Tab value="performance">Hiệu suất</Tabs.Tab>
          <Tabs.Tab value="strengths">Điểm mạnh</Tabs.Tab>
          <Tabs.Tab value="weaknesses">Điểm yếu</Tabs.Tab>
          <Tabs.Tab value="recommendations">Đề xuất</Tabs.Tab>
          <Tabs.Tab value="deepdive">Phân tích chi tiết</Tabs.Tab>
        </Tabs.List>

        {/* Tổng quan */}
        <Tabs.Panel value="overview" pt="md">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="sm" className="whitespace-pre-line">
              {analysis_report?.human_readable_report || "Chưa có báo cáo"}
            </Text>

            {structured.overallPerformance && (
              <Group mt="md" spacing="xl">
                <Badge color="green" size="lg">
                  Đúng: {structured.overallPerformance.correctAnswers}/
                  {structured.overallPerformance.totalQuestions}
                </Badge>
                <Badge color="blue" size="lg">
                  Tỉ lệ chính xác: {structured.overallPerformance.accuracyRate}
                </Badge>
                <Badge color="purple" size="lg">
                  Thời gian TB: {structured.overallPerformance.averageTimePerQuestion}s
                </Badge>
              </Group>
            )}
          </Card>
        </Tabs.Panel>

        {/* Hiệu suất theo chủ đề */}
        <Tabs.Panel value="performance" pt="md">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4}>Hiệu suất theo chủ đề</Title>
            {topicData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topicData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="topic" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="accuracy" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Text size="sm">Chưa có dữ liệu</Text>
            )}
          </Card>
        </Tabs.Panel>

        {/* Điểm mạnh */}
        <Tabs.Panel value="strengths" pt="md">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            {structured.cognitiveStrengths?.length > 0 ? (
              <ul className="list-disc list-inside mt-2 space-y-2">
                {structured.cognitiveStrengths.map((item, idx) => (
                  <li key={idx}>
                    <Title order={4}>{item.sub_topic}</Title>{" "}
                    – {item.evidence}
                  </li>
                ))}
              </ul>
            ) : (
              <Text size="sm">Chưa có dữ liệu</Text>
            )}
          </Card>
        </Tabs.Panel>

        {/* Điểm yếu */}
        <Tabs.Panel value="weaknesses" pt="md">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            {structured.cognitiveWeaknesses ? (
              <>
                {/* Lỗ hổng kiến thức */}
                <Text size="sm" weight={500}>
                  Lỗ hổng kiến thức:
                </Text>
                {Array.isArray(structured.cognitiveWeaknesses.knowledgeGaps) &&
                structured.cognitiveWeaknesses.knowledgeGaps.length > 0 ? (
                  <ul className="list-disc list-inside ml-4 text-sm">
                    {structured.cognitiveWeaknesses.knowledgeGaps.map((gap, idx) => {
                      if (typeof gap === "string") {
                        return <li key={idx}>{gap}</li>;
                      }
                      return (
                        <li key={idx}>
                          <strong>{gap.topic}</strong> – {gap.sub_topic} ({gap.difficulty})
                          {gap.notes && (
                            <div className="text-gray-600 text-xs">{gap.notes}</div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <Text size="sm" className="ml-4 text-gray-600">
                    Không có lỗ hổng kiến thức
                  </Text>
                )}

                {/* Hiểu sai thường gặp */}
                <Text size="sm" weight={500} className="mt-2">
                  Hiểu sai thường gặp:
                </Text>
                {Array.isArray(structured.cognitiveWeaknesses.misconceptions) ? (
                  structured.cognitiveWeaknesses.misconceptions.length > 0 ? (
                    <ul className="list-disc list-inside ml-4 text-sm">
                      {structured.cognitiveWeaknesses.misconceptions.map((mis, idx) => {
                        if (typeof mis === "string") {
                          return <li key={idx}>{mis}</li>;
                        }
                        return (
                          <li key={idx}>
                            <strong>{mis.topic}</strong> – {mis.sub_topic}
                            {mis.description && (
                              <div className="text-gray-600 text-xs">{mis.description}</div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <Text size="sm" className="ml-4 text-gray-600">
                      Không có quan niệm sai lầm
                    </Text>
                  )
                ) : typeof structured.cognitiveWeaknesses.misconceptions === "string" ? (
                  <Text size="sm" className="ml-4 text-gray-600">
                    {structured.cognitiveWeaknesses.misconceptions}
                  </Text>
                ) : (
                  <Text size="sm" className="ml-4 text-gray-600">
                    Không có dữ liệu
                  </Text>
                )}
              </>
            ) : (
              <Text size="sm">Chưa có dữ liệu</Text>
            )}
          </Card>
        </Tabs.Panel>



        {/* Đề xuất */}
        <Tabs.Panel value="recommendations" pt="md">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            {structured.actionableRecommendations?.length > 0 ? (
              <ul className="list-disc list-inside mt-2 space-y-1">
                {structured.actionableRecommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm">
                    {rec}
                  </li>
                ))}
              </ul>
            ) : (
              <Text size="sm">Chưa có dữ liệu</Text>
            )}
          </Card>
        </Tabs.Panel>

        {/* Phân tích chi tiết */}
        <Tabs.Panel value="deepdive" pt="md">
          <div className="space-y-4">
            {structured.deepDiveAnalysis?.map((q, idx) => (
              <Card key={idx} shadow="sm" padding="lg" radius="md" withBorder>
                <Text weight={500} size="sm" className="mb-2">
                  Câu hỏi: {q.content}
                </Text>
                <Text size="sm" color="dimmed">
                  Lỗi: {q.errorClassification}
                </Text>
                <Text size="sm">
                  Kỹ năng cần cải thiện: {q.keySkillFailure}
                </Text>
                <Text size="sm" className="italic">
                  Suy nghĩ của HS: {q.probableThoughtProcess}
                </Text>
              </Card>
            ))}
          </div>
        </Tabs.Panel>
      </Tabs>
  );
};

export default ContestResult;
