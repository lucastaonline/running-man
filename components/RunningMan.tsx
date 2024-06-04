"use client";
import { useEffect, useState, useRef } from "react";
import { DateTime, Duration } from "luxon";
import Image from "next/image";
import Counter from "@/components/Counter";
import { useInterval } from "@/hooks/useInterval";

export default function RunningMan() {
  const dataUltimaVerificacao = useRef(DateTime.now());
  const [quantidadeCliquesUltimoSegundo, setQuantidadeCliquesUltimoSegundo] =
    useState(0);
  const comecandoCorrida = useRef(false);
  const cancelarCorrida = useRef(false);
  const correndo = useRef(false);
  const parandoCorrida = useRef(false);
  const [falas, setFalas] = useState("");
  const [pumpit, setPumpit] = useState(null as null | HTMLAudioElement);
  const audioTocando = useRef(false);

  const [duracao, setDuracao] = useState(Duration.fromMillis(0));

  const [src, setSrc] = useState("parado.png");

  const intervalCorridaId = useRef(
    null as null | ReturnType<typeof setInterval>
  );

  const rodandoContador = useRef(false);

  const [melhorPontuacao, setMelhorPontuacao] = useState(
    null as null | Duration
  );

  const falasTempos = useRef({
    umSegundo: false,
    dezSegundos: false,
    trintaSegundos: false,
    umMinuto: false,
    cincoMinutos: false,
    dezMinutos: false,
    trintaMinutos: false,
    umaHora: false,
    cincoHoras: false,
  });

  useEffect(() => {
    setMelhorPontuacao(obterMelhorPontuacao());
    setPumpit(new Audio("/pumpit.mp3"));
  }, []);

  useInterval(() => {
    if (correndo.current) gerenciarFalas();

    let jaPassouSegundo =
      DateTime.now().diff(dataUltimaVerificacao.current, "seconds").seconds > 1;

    if (jaPassouSegundo) {
      console.log(quantidadeCliquesUltimoSegundo);
      let deveCorrer: boolean = quantidadeCliquesUltimoSegundo > 3;

      if (!deveCorrer) {
        if (correndo.current) {
          pararCorrida();
        } else if (comecandoCorrida.current) {
          cancelarCorrida.current = true;
        }
      } else if (
        !correndo.current &&
        !parandoCorrida.current &&
        !comecandoCorrida.current
      ) {
        comecarCorrida();
      }

      setQuantidadeCliquesUltimoSegundo(0);
      dataUltimaVerificacao.current = DateTime.now();
    }
  }, 1);

  function gerenciarFalas() {
    let falouAlgo = false;

    if (!falasTempos.current.umSegundo && duracao.as("seconds") >= 1) {
      falouAlgo = true;
      falasTempos.current.umSegundo = true;
      setFalas("Vai desistir rapidinho...");
    }

    if (!falasTempos.current.dezSegundos && duracao.as("seconds") >= 10) {
      falouAlgo = true;
      falasTempos.current.dezSegundos = true;
      setFalas("Vamos ver se você é bom mesmo...");
    }

    if (!falasTempos.current.trintaSegundos && duracao.as("seconds") >= 30) {
      falouAlgo = true;
      falasTempos.current.trintaSegundos = true;
      setFalas("Te falta ódio...");
    }

    if (!falasTempos.current.umMinuto && duracao.as("minutes") >= 1) {
      falouAlgo = true;
      falasTempos.current.umMinuto = true;
      setFalas("Um minuto hein.... está ficando interessante");
    }

    if (!falasTempos.current.cincoMinutos && duracao.as("minutes") >= 5) {
      falouAlgo = true;
      falasTempos.current.cincoMinutos = true;
      setFalas("Eu tenho todo tempo do mundo...");
    }

    if (!falasTempos.current.dezMinutos && duracao.as("minutes") >= 10) {
      falouAlgo = true;
      falasTempos.current.dezMinutos = true;
      setFalas("A coisa está ficando séria mesmo....");
    }

    if (!falasTempos.current.trintaMinutos && duracao.as("minutes") >= 30) {
      falouAlgo = true;
      falasTempos.current.trintaMinutos = true;
      setFalas("Tá bom, chega...");
    }

    if (!falasTempos.current.umaHora && duracao.as("hours") >= 1) {
      falouAlgo = true;
      falasTempos.current.umaHora = true;
      setFalas("Você não tem vida não irmão? Vai trabalhar...");
    }

    if (!falasTempos.current.cincoHoras && duracao.as("hours") >= 5) {
      falouAlgo = true;
      falasTempos.current.cincoHoras = true;
      setFalas(
        "Não consigo acreditar que você ainda está aqui. Sério. Vai no médico."
      );
    }

    if (falouAlgo) setTimeout(() => setFalas(""), 3000);
  }

  function resetarFalas() {
    falasTempos.current = {
      umSegundo: false,
      dezSegundos: false,
      trintaSegundos: false,
      umMinuto: false,
      cincoMinutos: false,
      dezMinutos: false,
      trintaMinutos: false,
      umaHora: false,
      cincoHoras: false,
    };
  }

  function adicionarCliqueAoSegundo() {
    setQuantidadeCliquesUltimoSegundo(quantidadeCliquesUltimoSegundo + 1);
  }

  function comecarCorrida() {
    comecandoCorrida.current = true;

    let indice = 0;

    let intervalId: any = null;

    intervalId = setInterval(() => {
      if (indice == 3 && intervalId != null) {
        clearInterval(intervalId);
        comecandoCorrida.current = false;
        if (cancelarCorrida.current) {
          pararCorrida();
        } else {
          correr();
        }
      } else {
        setSrc(`comecando/${indice}.png`);
      }

      indice++;
    }, 60);
  }

  function correr() {
    if (!audioTocando.current) {
      if (pumpit != null) pumpit.play();
      audioTocando.current = true;
    }

    setDuracao(Duration.fromMillis(0));
    rodandoContador.current = true;
    correndo.current = true;

    let indice = 0;

    intervalCorridaId.current = setInterval(function () {
      let reiniciarLoopCorrida: boolean = indice == 6;
      if (reiniciarLoopCorrida) indice = 0;

      setSrc(`correndo/${indice}.png`);
      indice++;
    }, 60);
  }

  function pararCorrida() {
    if (audioTocando.current) {
      if (pumpit != null) {
        pumpit.pause();
        pumpit.currentTime = 0;
      }
      audioTocando.current = false;
    }

    rodandoContador.current = false;
    gerenciarMelhorPontuacao();
    resetarFalas();

    if (intervalCorridaId.current != null)
      clearInterval(intervalCorridaId.current);
    intervalCorridaId.current = null;

    correndo.current = false;
    parandoCorrida.current = true;

    let indice = 0;
    let intervalId: any = null;

    intervalId = setInterval(() => {
      let acabouPararCorrida: boolean = indice == 36;

      if (acabouPararCorrida) {
        if (intervalId != null) clearInterval(intervalId);
        parandoCorrida.current = false;
        setFalas("");
        setSrc(`parado.png`);
      } else {
        setSrc(`parando/${indice}.png`);
      }

      indice++;
    }, 60);
  }

  function copiarParaTransferencia() {
    alert("Pontuação copiada pra área de transferência.");
    navigator.clipboard.writeText(
      `#RUN Melhor tempo de corrida: ${melhorPontuacao?.toFormat(
        "hh:mm:ss.SSS"
      )}. ${window.location.href} `
    );
  }

  function obterMelhorPontuacao(): null | Duration {
    let melhorPontuacao = localStorage.getItem("melhor-pontuacao");

    if (melhorPontuacao == null) return null;

    let melhorPontuacaoObjeto: Duration = Duration.fromObject(
      JSON.parse(melhorPontuacao)
    );

    return melhorPontuacaoObjeto;
  }

  function gerenciarMelhorPontuacao() {
    setDuracao(duracao); // Setando pra o momento em que realmente parou
    let melhorPontuacaoObjeto = obterMelhorPontuacao();

    if (melhorPontuacaoObjeto != null && duracao < melhorPontuacaoObjeto) {
      setFalas("Você vai ter que fazer melhor que isso...");
      return;
    }

    setFalas("Está melhorando...");

    localStorage.setItem(
      "melhor-pontuacao",
      JSON.stringify(duracao.toObject())
    );

    setMelhorPontuacao(obterMelhorPontuacao());

    console.log("duracao gerenciamento", duracao);
  }

  return (
    <div>
      <div className="flex justify-between">
        <p>{falas}</p>
        <div className="text-right">
          <p>
            <Counter
              rodando={rodandoContador.current}
              duracao={duracao}
              setDuracao={setDuracao}
            />
          </p>
          {melhorPontuacao != null ? (
            <p
              className="cursor-pointer hover:font-bold"
              onClick={copiarParaTransferencia}
            >
              Melhor tempo: {melhorPontuacao.toFormat("hh:mm:ss:SSS")}
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex items-baseline">
        <Image
          src={"/" + src}
          width={640}
          height={360}
          style={{ height: "auto", width: "auto" }}
          alt="stickman"
          priority
        />
        <div
          style={{ height: `${quantidadeCliquesUltimoSegundo}rem` }}
          className="w-4 bg-red-600 transition-all duration-500"
        ></div>
      </div>

      <div className="flex justify-center mt-36">
        <button
          className="hover:bg-gray-100 font-bold py-2 px-4 rounded border-solid border border-black"
          onClick={(x) => adicionarCliqueAoSegundo()}
        >
          Clique repetidamente para correr!
        </button>
      </div>
    </div>
  );
}
