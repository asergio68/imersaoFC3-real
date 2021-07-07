package kafka

import kafka2 "github.com/confluentinc/confluent-kafka-go/kafka"

type KafkaProducer struct {
	Producer *kafka2.Producer
}

func NewKafkaProducer () KafkaProducer {
	return KafkaProducer{}
}

func (k *KafkaProducer) SetupProducer(bootstrapServer string) {
	configMap := &kafka2.ConfigMap {
		"bootstrap.servers": bootstrapServer,
	}
	k.Producer, _ = kafka2.NewProducer(configMap)
}

func (k *KafkaProducer) Publish (msg string, topic string) error {
	message := &kafka2.Message{
		TopicPartition: kafka2.TopicPartition{Topic: &topic, Partition: kafka2.PartitionAny },
		Value: []byte(msg),
	}

	err := k.Producer.Produce(message, nil)
	if err != nil {
		return err
	}
	return nil
}