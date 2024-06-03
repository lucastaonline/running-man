import { useInterval } from "@/hooks/useInterval";
import { Duration, DateTime } from "luxon";
import { useRef } from "react";

export default function Counter({
  rodando,
  duracao,
  setDuracao,
}: {
  rodando: boolean;
  duracao: Duration;
  setDuracao: Function;
}) {
  const dataUltimaVerificacao = useRef(DateTime.now());

  useInterval(() => {
    const jaPassouMillisegundo =
      DateTime.now().diff(dataUltimaVerificacao.current, "milliseconds")
        .milliseconds > 1;

    if (jaPassouMillisegundo && rodando) {
      setDuracao(
        duracao.plus({
          milliseconds: DateTime.now().diff(
            dataUltimaVerificacao.current,
            "milliseconds"
          ).milliseconds,
        })
      );
    }

    dataUltimaVerificacao.current = DateTime.now();
  }, 1);

  return <>{duracao.toFormat("hh:mm:ss.SSS")}</>;
}
