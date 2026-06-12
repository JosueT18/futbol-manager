import { useEffect, useState } from "react"

import {
  DndContext,
  useDraggable,
} from "@dnd-kit/core"

import { Eye } from "lucide-react"

import { getTeams } from "../api/teams"

import { getPlayers } from "../api/players"

import {
  createFormation,
  getFormations,
  deleteFormation,
  updateFormation,
} from "../api/formations"

import Card from "../components/ui/Card"

// =========================
// AUTH
// =========================
function getUserRole() {

  return (
    localStorage.getItem("role")
    ||
    ""
  ).trim()
}

// =========================
// PLAYER TOKEN
// =========================
function PlayerToken({
  item,
  canManageFormation
}: any) {

  if (
    !item ||
    !item.player ||
    !item.player.id
  ) {
    return null
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({

    id:
      item.player.id.toString(),

    disabled:
      !canManageFormation,
  })

  const style = {

    position:
      "absolute" as const,

    left:
      item.x,

    top:
      item.y,

    transform:
      transform
        ? `
          translate3d(
            ${transform.x}px,
            ${transform.y}px,
            0
          )
        `
        : undefined,
  }

  return (

    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="
        w-12
        h-12
        rounded-full
        bg-blue-700
        border-2
        border-white
        shadow-xl
        text-white
        flex
        flex-col
        items-center
        justify-center
        cursor-grab
        z-20
      "
    >

      <span className="text-[10px] font-bold">
        {item.player.number}
      </span>

      <span className="text-[8px] truncate px-1">
        {item.player.name}
      </span>

    </div>
  )
}

// =========================
// MAIN
// =========================
function Formacion() {
  const role = getUserRole()

  const isPlayer =
    role === "Jugador"
    role === "Comision"

  const canManageFormation = [

    "Administrador",

    "Director",

    //"Comision",        

  ].includes(role)

  const [teams, setTeams] =
    useState<any[]>([])

  const [players, setPlayers] =
    useState<any[]>([])

  const [formations, setFormations] =
    useState<any[]>([])

  const [teamId, setTeamId] =
    useState("")

  const [formationName, setFormationName] =
    useState("")

  const [matchType, setMatchType] =
    useState(11)

  const [tactic, setTactic] =
    useState("4-3-3")

  const [starters, setStarters] =
    useState<any[]>([])

  const [substitutes, setSubstitutes] =
    useState<any[]>([])

  const [editingId, setEditingId] =
    useState<number | null>(null)

  //=============
  //MODAL
  //===========
  const [modalOpen, setModalOpen] =
    useState(false)

  const [modalTitle, setModalTitle] =
    useState("")

  const [modalMessage, setModalMessage] =
    useState("")

  const[confirmAction, setConfirmAction] =
    useState<any>(null)

  // =========================
  // LOAD
  // =========================
  useEffect(() => {

    loadData()

  }, [])

  async function loadData() {

    try {

      const [
        teamsData,
        playersData,
        formationsData,
      ] = await Promise.all([

        getTeams(),

        getPlayers(),

        getFormations(),
      ])

      setTeams(
        Array.isArray(teamsData)
          ? teamsData
          : []
      )

      const approvedPlayers =
        Array.isArray(playersData)
          ? playersData.filter(
              (p: any) =>
                p.status === "approved"
            )
          : []

      setPlayers(
        approvedPlayers
      )

      const safeFormations =
        Array.isArray(formationsData)
          ? formationsData.map(
              (f: any) => ({

                ...f,

                players:
                  Array.isArray(f.players)
                    ? f.players
                    : [],
              })
            )
          : []

      setFormations(
        safeFormations
      )

    } catch (error) {

      console.error(error)
    }
  }
  // =========================
  // RESET
  // =========================
  function resetForm() {

    setEditingId(null)

    setFormationName("")

    setTactic("4-3-3")

    setMatchType(11)

    setTeamId("")

    setStarters([])

    setSubstitutes([])
  }

    // =========================
    // SHOW MODAL
    // =========================
    function showModal(
      title: string,
      message: string
    ) {

      setModalTitle(title)

      setModalMessage(message)

      setConfirmAction(null)

      setModalOpen(true)
    }

    // =========================
    // SHOW CONFIRM
    // =========================
    function showConfirm(
      title: string,
      message: string,
      action: any
    ) {

      setModalTitle(title)

      setModalMessage(message)

      setConfirmAction(() => action)

      setModalOpen(true)
    }
  // =========================
  // VIEW / EDIT FORMATION
  // =========================
  function loadFormation(
    formation: any,
    enableEdit = false
  ) {

    if (
      enableEdit &&
      !canManageFormation
    ) {
      return
    }

    if (enableEdit) {

      setEditingId(
        formation.id
      )

    } else {

      setEditingId(null)
    }

    setFormationName(
      formation.name
    )

    setTactic(
      formation.tactic
    )

    setMatchType(
      Number(
        formation.match_type
      )
    )

    setTeamId(
      formation.team_id.toString()
    )

    const startersLoaded =
      formation.players
        .filter(
          (p: any) =>
            p.role === "starter"
        )
        .map((p: any) => {

          const player =
            players.find(
              (pl: any) =>
                pl.id === p.player_id
            )

          if (!player) {
            return null
          }

          return {

            player,

            x:
              p.position_x,

            y:
              p.position_y,
          }
        })
        .filter(Boolean)

    const substitutesLoaded =
      formation.players
        .filter(
          (p: any) =>
            p.role === "substitute"
        )
        .map((p: any) =>

          players.find(
            (pl: any) =>
              pl.id === p.player_id
          )
        )
        .filter(Boolean)

    setStarters(
      startersLoaded
    )

    setSubstitutes(
      substitutesLoaded
    )
  }

  // =========================
  // PLAYERS AVAILABLE
  // =========================
  const availablePlayers =
    players.filter(
      (player: any) => {

        if (
          !player ||
          !player.id
        ) {
          return false
        }

        const sameTeam =
          Number(player.team_id)
          ===
          Number(teamId)

        const isStarter =
          starters.some(
            (s: any) =>
              s?.player?.id === player.id
          )

        const isSubstitute =
          substitutes.some(
            (s: any) =>
              s?.id === player.id
          )

        return (
          sameTeam
          &&
          !isStarter
          &&
          !isSubstitute
        )
      }
    )

  // =========================
  // ADD STARTER
  // =========================
  function addStarter(
    player: any
  ) {

    if (
      !player ||
      !player.id
    ) {
      return
    }

    const exists =
      starters.find(
        (p: any) =>
          p?.player?.id === player.id
      )

    if (exists) {
      return
    }

    setSubstitutes((prev: any) =>
      prev.filter(
        (p: any) =>
          p?.id !== player.id
      )
    )

    setStarters((prev: any) => [

      ...prev,

      {
        player,
        x: 350,
        y: 250,
      },
    ])
  }

  // =========================
  // ADD SUBSTITUTE
  // =========================
  function addSubstitute(
    player: any
  ) {

    if (
      !player ||
      !player.id
    ) {
      return
    }

    const exists =
      substitutes.find(
        (p: any) =>
          p?.id === player.id
      )

    if (exists) {
      return
    }

    setStarters((prev: any) =>
      prev.filter(
        (p: any) =>
          p?.player?.id !== player.id
      )
    )

    setSubstitutes((prev: any) => [
      ...prev,
      player,
    ])
  }

  // =========================
  // REMOVE STARTER
  // =========================
  function removeStarter(
    playerId: number
  ) {

    setStarters((prev: any) =>
      prev.filter(
        (p: any) =>
          p.player.id !== playerId
      )
    )
  }

  // =========================
  // REMOVE SUBSTITUTE
  // =========================
  function removeSubstitute(
    playerId: number
  ) {

    setSubstitutes((prev: any) =>
      prev.filter(
        (p: any) =>
          p.id !== playerId
      )
    )
  }

  // =========================
  // DRAG
  // =========================
  function handleDragEnd(
    event: any
  ) {

    const {
      delta,
      active,
    } = event

    setStarters((prev: any) =>

      prev.map((item: any) => {

        if (
          item.player.id.toString()
          ===
          active.id.toString()
        ) {

          return {

            ...item,

            x:
              item.x + delta.x,

            y:
              item.y + delta.y,
          }
        }

        return item
      })
    )
  }

  // =========================
  // SAVE
  // =========================
  async function saveFormation() {

    try {

      const payload = {

        name:
          formationName,

        tactic,

        match_type:
          matchType,

        team_id:
          Number(teamId),

        players: [

          ...starters.map(
            (p: any) => ({

              player_id:
                p.player.id,

              role:
                "starter",

              position_x:
                p.x,

              position_y:
                p.y,
            })
          ),

          ...substitutes.map(
            (p: any) => ({

              player_id:
                p.id,

              role:
                "substitute",

              position_x: 0,

              position_y: 0,
            })
          ),
        ],
      }

      if (editingId) {

        await updateFormation(
          editingId,
          payload
        )

        showModal(
          "Formación actualizada",
          "La formación fue actualizada correctamente."
        )

      } else {

        await createFormation(
          payload
        )

        showModal(
          "Formación guardada",
          "La formación fue guardada correctamente."
        )
      }

      await loadData()

      resetForm()

    } catch (error) {

      console.error(error)

      showModal(
        "Error",
        "Ocurrió un error al guardar la formación."
      )
    }
  }

// =========================
// DELETE
// =========================
function removeFormation(
  id: number
) {

  showConfirm(

    "Eliminar formación",

    "¿Seguro que deseas eliminar esta formación?",

    async () => {

      try {

        await deleteFormation(id)

        await loadData()

        resetForm()

        setModalOpen(false)

        setTimeout(() => {

          showModal(
            "Formación eliminada",
            "La formación fue eliminada correctamente."
          )

        }, 150)

      } catch (error) {

        console.error(error)

        showModal(
          "Error",
          "No se pudo eliminar la formación."
        )
      }
    }
  )
}

  return (

<>

<div className="p-6 space-y-6">

  {/* HEADER */}
  <div>

    <h1 className="text-4xl font-bold">
      Formación
    </h1>

    <p className="text-gray-500 mt-2">
      Gestión táctica avanzada
    </p>

  </div>

  {/* CONFIG */}
  {
    canManageFormation && (

      <Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Nombre formación"
            value={formationName}
            onChange={(e) =>
              setFormationName(
                e.target.value
              )
            }
            className="border p-3 rounded-xl"
          />

          <select
            value={teamId}
            onChange={(e) =>
              setTeamId(
                e.target.value
              )
            }
            className="border p-3 rounded-xl"
          >

            <option value="">
              Equipo
            </option>

            {
              teams.map(
                (team: any) => (

                  <option
                    key={team.id}
                    value={team.id}
                  >
                    {team.name}
                  </option>
                )
              )
            }

          </select>

          <select
            value={matchType}
            onChange={(e) =>
              setMatchType(
                Number(
                  e.target.value
                )
              )
            }
            className="border p-3 rounded-xl"
          >

            <option value={11}>
              Fútbol 11
            </option>

            <option value={9}>
              Fútbol 9
            </option>

            <option value={7}>
              Fútbol 7
            </option>

            <option value={5}>
              Fútbol 5
            </option>

          </select>

          <input
            type="text"
            value={tactic}
            onChange={(e) =>
              setTactic(
                e.target.value
              )
            }
            placeholder="4-3-3"
            className="border p-3 rounded-xl"
          />

        </div>

      </Card>
    )
  }

  {/* MAIN */}
  <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

    {/* LEFT */}
        <div className="space-y-4">

      {canManageFormation && (

        <>

          {/* PLANTILLA */}
          <Card>

            <h2 className="text-lg font-bold mb-3">
              Plantilla
            </h2>

            <div className="space-y-2 max-h-[320px] overflow-auto">

              {availablePlayers.map((player: any) => (

                <div
                  key={player.id}
                  className="
                    bg-gray-50
                    rounded-xl
                    p-2
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div>

                    <p className="text-sm font-semibold">
                      {player.name}
                    </p>

                  </div>

                  <div className="flex gap-1">

                    <button
                      onClick={() =>
                        addStarter(player)
                      }
                      className="
                        px-2
                        py-1
                        text-xs
                        rounded-lg
                        bg-blue-600
                        text-white
                      "
                    >
                      Titular
                    </button>

                    <button
                      onClick={() =>
                        addSubstitute(player)
                      }
                      className="
                        px-2
                        py-1
                        text-xs
                        rounded-lg
                        bg-yellow-500
                        text-white
                      "
                    >
                      Suplente
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </Card>

          {/* TITULARES */}
          <Card>

            <h2 className="text-lg font-bold mb-3">
              Titulares
            </h2>

            <div className="space-y-2">

              {starters.map((item: any) => (

                <div
                  key={item.player.id}
                  className="
                    bg-blue-50
                    rounded-xl
                    p-2
                    flex
                    items-center
                    justify-between
                  "
                >

                  <span className="text-sm font-semibold">
                    #{item.player.number} {item.player.name}
                  </span>

                  <button
                    onClick={() =>
                      removeStarter(
                        item.player.id
                      )
                    }
                    className="
                      text-xs
                      bg-red-500
                      text-white
                      px-2
                      py-1
                      rounded-lg
                    "
                  >
                    Quitar
                  </button>

                </div>

              ))}

            </div>

          </Card>

          {/* SUPLENTES */}
          <Card>

            <h2 className="text-lg font-bold mb-3">
              Suplentes
            </h2>

            <div className="space-y-2">

              {substitutes.map((player: any) => (

                <div
                  key={player.id}
                  className="
                    bg-yellow-50
                    rounded-xl
                    p-2
                    flex
                    items-center
                    justify-between
                  "
                >

                  <span className="text-sm font-semibold">
                    #{player.number} {player.name}
                  </span>

                  <button
                    onClick={() =>
                      removeSubstitute(
                        player.id
                      )
                    }
                    className="
                      text-xs
                      bg-red-500
                      text-white
                      px-2
                      py-1
                      rounded-lg
                    "
                  >
                    Quitar
                  </button>

                </div>

              ))}

            </div>

          </Card>

          {/* ACTIONS */}
          <Card>

            <div className="flex flex-col gap-3">

              <button
                onClick={saveFormation}
                className="
                  bg-black
                  text-white
                  py-3
                  rounded-xl
                  hover:bg-gray-800
                  transition-all
                "
              >

                {
                  editingId
                    ? "Actualizar Formación"
                    : "Guardar Formación"
                }

              </button>

              <button
                onClick={resetForm}
                className="
                  bg-gray-200
                  py-3
                  rounded-xl
                  hover:bg-gray-300
                  transition-all
                "
              >
                Nueva Formación
              </button>

            </div>

          </Card>

        </>

      )}

      {/* FORMACIONES GUARDADAS */}
      <Card>

        <div className="flex items-center justify-between mb-4">

          <h2 className="text-lg font-bold">
            Formaciones Guardadas
          </h2>

          <span
            className="
              text-xs
              bg-gray-100
              text-gray-600
              px-3
              py-1
              rounded-full
              font-medium
            "
          >
            {formations.length} formaciones
          </span>

        </div>

        <div className="space-y-3 max-h-[500px] overflow-auto pr-1">

          {formations.length === 0 && (

            <div
              className="
                text-center
                py-10
                text-gray-400
                text-sm
              "
            >
              No hay formaciones guardadas
            </div>

          )}

          {formations
            .filter(
              (formation: any) =>
                formation &&
                formation.id
            )
            .map((formation: any) => (

              <div
                key={formation.id}
                className="
                  border
                  border-gray-200
                  rounded-2xl
                  p-4
                  bg-white
                  shadow-sm
                  hover:shadow-md
                  transition-all
                "
              >

                <div className="flex items-start justify-between gap-3">

                  <div className="flex-1 min-w-0">

                    <h3
                      className="
                        font-bold
                        text-base
                        text-gray-800
                        truncate
                      "
                    >
                      {formation.name}
                    </h3>

                    <div className="flex flex-wrap gap-2 mt-2">

                      <span
                        className="
                          bg-blue-100
                          text-blue-700
                          text-xs
                          font-semibold
                          px-2
                          py-1
                          rounded-lg
                        "
                      >
                        {formation.tactic}
                      </span>

                      <span
                        className="
                          bg-green-100
                          text-green-700
                          text-xs
                          font-semibold
                          px-2
                          py-1
                          rounded-lg
                        "
                      >
                        Fútbol {formation.match_type}
                      </span>

                    </div>

                  </div>

                </div>

                <div
                  className={
                    canManageFormation
                      ? "grid grid-cols-3 gap-2 mt-4"
                      : "grid grid-cols-1 gap-2 mt-4"
                  }
                >

                  <button
                    onClick={() =>
                      loadFormation(
                        formation,
                        false
                      )
                    }
                    className="
                      flex
                      items-center
                      justify-center
                      gap-1
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      text-xs
                      font-semibold
                      py-2
                      rounded-xl
                      transition-all
                    "
                  >

                    <Eye size={14} />

                    Ver

                  </button>

                  {canManageFormation && (

                    <button
                      onClick={() =>
                        loadFormation(
                          formation,
                          true
                        )
                      }
                      className="
                        bg-black
                        hover:bg-gray-800
                        text-white
                        text-xs
                        font-semibold
                        py-2
                        rounded-xl
                        transition-all
                      "
                    >
                      Editar
                    </button>

                  )}

                  {canManageFormation && (

                    <button
                      onClick={() =>
                        removeFormation(
                          formation.id
                        )
                      }
                      className="
                        bg-red-600
                        hover:bg-red-700
                        text-white
                        text-xs
                        font-semibold
                        py-2
                        rounded-xl
                        transition-all
                      "
                    >
                      Borrar
                    </button>

                  )}

                </div>

              </div>

            ))}

        </div>

      </Card>

    </div>     
    

    {/* CANCHA */}
    <div
      className={
        canManageFormation
          ? "xl:col-span-3"
          : "xl:col-span-4"
      }
    >

      <DndContext
        onDragEnd={handleDragEnd}
      >

        <div
          className="
            relative
            mx-auto
            w-full
            max-w-[950px]
            h-[620px]
            rounded-[30px]
            overflow-hidden
            border-[8px]
            border-white
            shadow-2xl
            bg-gradient-to-r
            from-green-700
            via-green-600
            to-green-700
          "
        >

          <div
            className="
              absolute
              left-1/2
              top-0
              bottom-0
              w-1
              bg-white
              -translate-x-1/2
            "
          />

          <div
            className="
              absolute
              w-40
              h-40
              border-4
              border-white
              rounded-full
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
            "
          />

          {/* ARCO IZQUIERDO */}
          <div
            className="
              absolute
              left-0
              top-1/2
              -translate-y-1/2
              w-6
              h-24
              border-4
              border-white
              border-l-0
            "
          />

          {/* ARCO DERECHO */}
          <div
            className="
              absolute
              right-0
              top-1/2
              -translate-y-1/2
              w-6
              h-24
              border-4
              border-white
              border-r-0
            "
          />

          {
            starters.map(
              (item: any) => (

                <PlayerToken
                  key={
                    item.player.id
                  }
                  item={item}
                  canManageFormation={
                    canManageFormation
                  }
                />
              )
            )
          }

        </div>

      </DndContext>

    </div>

  </div>

</div>

{/* MODAL */}
{
  modalOpen && (

    <div
      className="
        fixed
        inset-0
        bg-black/60
        backdrop-blur-sm
        flex
        items-center
        justify-center
        z-[9999]
        animate-[fadeIn_.25s_ease]
      "
    >

      <div
        className="
          bg-white
          w-[420px]
          rounded-3xl
          shadow-2xl
          p-6
          animate-[scaleIn_.25s_ease]
        "
      >

        <h2
          className="
            text-2xl
            font-bold
            mb-3
          "
        >
          {modalTitle}
        </h2>

        <p
          className="
            text-gray-600
            mb-6
          "
        >
          {modalMessage}
        </p>

        <div className="flex justify-end gap-3">

          {
            confirmAction && (

              <button
                onClick={() => {

                  setModalOpen(false)

                  confirmAction()
                }}
                className="
                  px-5
                  py-2
                  rounded-xl
                  bg-red-600
                  text-white
                  font-semibold
                  hover:bg-red-700
                  transition-all
                "
              >
                Confirmar
              </button>
            )
          }

          <button
            onClick={() =>
              setModalOpen(false)
            }
            className="
              px-5
              py-2
              rounded-xl
              bg-black
              text-white
              font-semibold
              hover:bg-gray-800
              transition-all
            "
          >

            {
              confirmAction
                ? "Cancelar"
                : "Cerrar"
            }

          </button>

        </div>

      </div>

    </div>
  )
}


</>
)
}

export default Formacion